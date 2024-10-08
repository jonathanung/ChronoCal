'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

interface ExpenseType {
  _id: string;
  name: string;
}

export default function Expenses() {
  const [timeframe, setTimeframe] = useState<string>('month')
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>(mockExpenses)
  const [pieData, setPieData] = useState<any[]>([])
  const [histogramData, setHistogramData] = useState<any[]>([])
  const [statistics, setStatistics] = useState<{
    avgSpendingPerUnit: number,
    unitLabel: string,
    categoryStats: Record<string, any>
  }>({
    avgSpendingPerUnit: 0,
    unitLabel: 'day',
    categoryStats: {}
  })
  const [newExpense, setNewExpense] = useState({ amount: '', category: '', date: '', description: '', expense_type: '' })
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([])
  const [user, setUser] = useState(null)
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndExpenseTypes = async () => {
      try {
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, { withCredentials: true });
        if (userResponse.status === 200) {
          setUser(userResponse.data);
          console.log(userResponse.data);
          setExpenseTypes(userResponse.data.expense_types);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Error fetching user or expense types:', err);
        router.push('/');
      }
    };

    fetchUserAndExpenseTypes();
  }, []);

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
    const groupedData = filtered.reduce<Record<string, number>>((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0
      }
      acc[expense.category] += expense.amount
      return acc
    }, {})

    setPieData(Object.entries(groupedData).map(([name, value]) => ({ name, value: Number(value) })))

    // Prepare data for histogram
    const histogramDataTemp = filtered.reduce<Record<string, { date: string, total: number }>>((acc, expense) => {
      const key = expense.date
      if (!acc[key]) {
        acc[key] = { date: key, total: 0 }
      }
      acc[key].total += expense.amount
      return acc
    }, {})

    const sortedHistogramData = Object.values(histogramDataTemp).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
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
    const categoryStats = categories.reduce<Record<string, { total: number, avgPerUnit: number, comparison: number }>>((acc, category) => {
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

  const handleNewExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value })
  }

  const handleNewExpenseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/api/expenses', newExpense, { withCredentials: true })
      console.log('New expense created:', response.data)
      // Refresh expenses (you'll need to implement this function)
      // refreshExpenses()
      setNewExpense({ amount: '', category: '', date: '', description: '', expense_type: '' })
    } catch (error) {
      console.error('Error creating expense:', error)
    }
  }

  const handleExpenseTypeChange = (value: string) => {
    setNewExpense({ ...newExpense, expense_type: value });
  };

    return (
    <main className="">
        <Navbar isLoggedIn={true} />
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Expense Tracker</h1>
                <div className="flex items-center space-x-4">
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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Expense</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Expense</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleNewExpenseSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={handleNewExpenseChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                    id="category"
                                    name="category"
                                    value={newExpense.category}
                                    onChange={handleNewExpenseChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={newExpense.date}
                                    onChange={handleNewExpenseChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                    id="description"
                                    name="description"
                                    value={newExpense.description}
                                    onChange={handleNewExpenseChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="expense_type">Expense Type</Label>
                                    <Select 
                                      name="expense_type" 
                                      value={newExpense.expense_type} 
                                      onValueChange={handleExpenseTypeChange}
                                    >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an expense type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {expenseTypes.map((type: ExpenseType) => (
                                        <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit">Add Expense</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
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
    </main>
  )
}