'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

// Extended mock data spanning across two months
const mockExpenses = [
  { id: 1, amount: 50, category: 'Food', date: '2023-06-01' },
  { id: 2, amount: 100, category: 'Transport', date: '2023-06-03' },
  { id: 3, amount: 200, category: 'Rent', date: '2023-06-05' },
  { id: 4, amount: 30, category: 'Food', date: '2023-06-07' },
  { id: 5, amount: 80, category: 'Entertainment', date: '2023-06-10' },
  { id: 6, amount: 120, category: 'Transport', date: '2023-06-15' },
  { id: 7, amount: 40, category: 'Food', date: '2023-06-18' },
  { id: 8, amount: 60, category: 'Entertainment', date: '2023-06-22' },
  { id: 9, amount: 90, category: 'Food', date: '2023-06-25' },
  { id: 10, amount: 150, category: 'Rent', date: '2023-06-30' },
  { id: 11, amount: 70, category: 'Transport', date: '2023-07-02' },
  { id: 12, amount: 55, category: 'Food', date: '2023-07-05' },
  { id: 13, amount: 110, category: 'Entertainment', date: '2023-07-08' },
  { id: 14, amount: 85, category: 'Transport', date: '2023-07-12' },
  { id: 15, amount: 45, category: 'Food', date: '2023-07-15' },
  { id: 16, amount: 200, category: 'Rent', date: '2023-07-20' },
  { id: 17, amount: 65, category: 'Food', date: '2023-07-23' },
  { id: 18, amount: 95, category: 'Transport', date: '2023-07-26' },
  { id: 19, amount: 75, category: 'Entertainment', date: '2023-07-29' },
  { id: 20, amount: 60, category: 'Food', date: '2023-07-31' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
const STROKE_COLORS = ['#005299', '#00835A', '#A67700', '#A6522B', '#5956A6']

export function ExpenseTrackerComponent() {
  const [timeframe, setTimeframe] = useState('month')
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses)
  const [pieData, setPieData] = useState([])
  const [histogramData, setHistogramData] = useState([])
  const [statistics, setStatistics] = useState({
    avgSpendingPerUnit: 0,
    unitLabel: 'day',
    categoryStats: {}
  })

  useEffect(() => {
    // Filter expenses based on timeframe
    const now = new Date('2023-07-31') // Use the latest date from mock data
    const filtered = mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      switch (timeframe) {
        case 'day':
          return expenseDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return expenseDate >= weekAgo && expenseDate <= now
        case 'month':
          return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })

    setFilteredExpenses(filtered)

    // Group data for pie chart
    const groupedData = filtered.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0
      }
      acc[expense.category] += expense.amount
      return acc
    }, {})

    setPieData(Object.entries(groupedData).map(([name, value]) => ({ name, value: Number(value) })))

    // Prepare data for histogram
    const histogramDataTemp = filtered.reduce((acc, expense) => {
      const key = expense.date
      if (!acc[key]) {
        acc[key] = { date: key, total: 0 }
      }
      acc[key].total += expense.amount
      return acc
    }, {})

    const sortedHistogramData = Object.values(histogramDataTemp).sort((a, b) => new Date(a.date) - new Date(b.date))
    setHistogramData(sortedHistogramData)

    // Calculate statistics
    const totalDays = sortedHistogramData.length || 1 // Avoid division by zero
    const totalSpending = filtered.reduce((sum, expense) => sum + expense.amount, 0)
    let avgSpendingPerUnit = totalSpending
    let unitLabel = 'day'

    switch (timeframe) {
      case 'day':
        avgSpendingPerUnit = totalSpending
        unitLabel = 'day'
        break
      case 'week':
        avgSpendingPerUnit = totalSpending / 7
        unitLabel = 'day'
        break
      case 'month':
        avgSpendingPerUnit = totalSpending / 30 // Approximation
        unitLabel = 'day'
        break
      case 'year':
        avgSpendingPerUnit = totalSpending / 12
        unitLabel = 'month'
        break
    }

    const categories = Array.from(new Set(filtered.map(e => e.category)))
    const categoryStats = categories.reduce((acc, category) => {
      const categoryTotal = filtered.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)
      acc[category] = {
        total: categoryTotal,
        avgPerUnit: categoryTotal / totalDays,
        comparison: Math.random() * 20 - 10 // Mock comparison, replace with actual calculation
      }
      return acc
    }, {})

    setStatistics({
      avgSpendingPerUnit,
      unitLabel,
      categoryStats
    })

  }, [timeframe])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>
      <Select onValueChange={setTimeframe} defaultValue={timeframe}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Average Spending per {statistics.unitLabel}</h3>
                <p className="text-2xl font-bold">${statistics.avgSpendingPerUnit.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Category Breakdown</h3>
                {Object.entries(statistics.categoryStats).map(([category, stats]) => (
                  <div key={category} className="mt-2">
                    <h4 className="font-medium">{category}</h4>
                    <p>Avg. per {statistics.unitLabel}: ${stats.avgPerUnit.toFixed(2)}</p>
                    <p>Comparison: {stats.comparison > 0 ? '+' : ''}{stats.comparison.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Expenses Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={histogramData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
              <Line type="monotone" dataKey="total" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}