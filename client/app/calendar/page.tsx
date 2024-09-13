"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '../components/navbar'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const mockEvents = [
  { id: 1, title: 'Team Meeting', date: new Date(2024, 8, 5, 10, 0), duration: 60, color: 'bg-blue-200' },
  { id: 2, title: 'Project Deadline', date: new Date(2024, 8, 15, 17, 0), duration: 30, color: 'bg-red-200' },
  { id: 3, title: 'Lunch with Client', date: new Date(2024, 8, 10, 12, 30), duration: 90, color: 'bg-green-200' },
  { id: 4, title: 'Conference Call', date: new Date(2024, 8, 20, 15, 0), duration: 45, color: 'bg-yellow-200' },
  { id: 5, title: 'Birthday Party', date: new Date(2024, 8, 25, 19, 0), duration: 180, color: 'bg-purple-200' },
  { id: 6, title: 'New Year Party', date: new Date(2024, 0, 1, 22, 0), duration: 240, color: 'bg-pink-200' },
  { id: 7, title: 'Summer Vacation', date: new Date(2024, 6, 15, 9, 0), duration: 480, color: 'bg-indigo-200' },
  { id: 8, title: 'Christmas Eve', date: new Date(2024, 11, 24, 18, 0), duration: 360, color: 'bg-green-200' },
  { id: 9, title: 'Meeting A', date: new Date(2024, 8, 13, 10, 0), duration: 60, color: 'bg-blue-200' },
  { id: 10, title: 'Meeting B', date: new Date(2024, 8, 13, 10, 30), duration: 60, color: 'bg-green-200' },
  { id: 11, title: 'Meeting C', date: new Date(2024, 8, 13, 11, 0), duration: 60, color: 'bg-yellow-200' },
  { id: 12, title: 'Meeting D', date: new Date(2024, 8, 13, 12, 0), duration: 60, color: 'bg-blue-200' },
]

export default function Calendar() {
  const [date, setDate] = useState(new Date(2024, 8, 1))
  const [view, setView] = useState('month')
  const [daysToShow, setDaysToShow] = useState(3)
  const [scrollDirection, setScrollDirection] = useState(null)
  const contentRef = useRef(null)

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const getEventsForDate = (year, month, day) => {
    return mockEvents.filter(event => 
      event.date.getFullYear() === year &&
      event.date.getMonth() === month &&
      event.date.getDate() === day
    )
  }

  const formatEventTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  const formatEventEndTime = (date, duration) => {
    const endDate = new Date(date.getTime() + duration * 60000)
    return endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let i = 0; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const calculateEventPosition = (event, overlappingEvents) => {
    const startMinutes = event.date.getHours() * 60 + event.date.getMinutes()
    const top = (startMinutes / 1440) * 100 // 1440 minutes in a day
    const height = (event.duration / 1440) * 100
    const width = 100 / overlappingEvents.length
    const left = width * overlappingEvents.indexOf(event)
    return { top: `${top}%`, height: `${height}%`, width: `${width}%`, left: `${left}%` }
  }

  const getOverlappingEvents = (events) => {
    const sortedEvents = events.sort((a, b) => a.date - b.date)
    const overlappingGroups = []
    let currentGroup = []

    for (const event of sortedEvents) {
      if (currentGroup.length === 0) {
        currentGroup.push(event)
      } else {
        const lastEvent = currentGroup[currentGroup.length - 1]
        const lastEventEnd = new Date(lastEvent.date.getTime() + lastEvent.duration * 60000)
        if (event.date < lastEventEnd) {
          currentGroup.push(event)
        } else {
          overlappingGroups.push(currentGroup)
          currentGroup = [event]
        }
      }
    }

    if (currentGroup.length > 0) {
      overlappingGroups.push(currentGroup)
    }

    return overlappingGroups
  }

  const renderDayView = () => {
    const startOfDay = new Date(date)
    const timeSlots = generateTimeSlots()

    return (
      <motion.div
        key={date.toISOString()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid"
        style={{ gridTemplateColumns: `auto repeat(${daysToShow}, 1fr)` }}
      >
        <div className="sticky left-0 top-0 z-20 bg-white">
          <div className="h-6"></div>
          {timeSlots.map(slot => (
            <div key={slot} className="h-24 text-xs text-gray-500 text-right pr-2">
              {slot}
            </div>
          ))}
        </div>
        {Array.from({ length: daysToShow }).map((_, dayIndex) => {
          const currentDate = new Date(startOfDay)
          currentDate.setDate(startOfDay.getDate() + dayIndex)
          const events = getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
          const overlappingGroups = getOverlappingEvents(events)

          return (
            <div key={dayIndex} className="relative">
              <div className="sticky top-0 bg-white z-10 h-6 border-b border-gray-200 text-center font-semibold">
                {daysOfWeek[currentDate.getDay()]} {currentDate.getDate()}
              </div>
              <div className="relative" style={{ height: '100%' }}>
                {timeSlots.map((slot, index) => (
                  <div key={slot} className="absolute w-full border-t border-gray-200" style={{ top: `${(index / 24) * 100}%` }}></div>
                ))}
                {overlappingGroups.map((group, groupIndex) => (
                  group.map((event) => (
                    <motion.div
                      key={event.id}
                      className={`${event.color} p-2 rounded-lg absolute overflow-hidden`}
                      style={calculateEventPosition(event, group)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="font-semibold text-xs">{formatEventTime(event.date)} - {formatEventEndTime(event.date, event.duration)}</div>
                      <div className="text-xs">{event.title}</div>
                    </motion.div>
                  ))
                ))}
              </div>
            </div>
          )
        })}
      </motion.div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const timeSlots = generateTimeSlots()

    return (
      <motion.div
        key={date.toISOString()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-[auto,repeat(7,1fr)] gap-1"
      >
        <div className="sticky left-0 top-0 z-20 bg-white">
          <div className="h-6"></div>
          {timeSlots.map(slot => (
            <div key={slot} className="h-24 text-xs text-gray-500 text-right pr-2">
              {slot}
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, dayIndex) => {
          const currentDate = new Date(startOfWeek)
          currentDate.setDate(startOfWeek.getDate() + dayIndex)
          const events = getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
          const overlappingGroups = getOverlappingEvents(events)

          return (
            <div key={dayIndex} className="relative">
              <div className="sticky top-0 bg-white z-10 h-6 border-b border-gray-200 text-center font-semibold">
                {daysOfWeek[dayIndex]} {currentDate.getDate()}
              </div>
              <div className="relative" style={{ height: '100%' }}>
                {timeSlots.map((slot, index) => (
                  <div key={slot} className="absolute w-full border-t border-gray-200" style={{ top: `${(index / 24) * 100}%` }}></div>
                ))}
                {overlappingGroups.map((group, groupIndex) => (
                  group.map((event) => (
                    <motion.div
                      key={event.id}
                      className={`${event.color} p-1 rounded-lg absolute overflow-hidden`}
                      style={calculateEventPosition(event, group)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="font-semibold text-xs">{formatEventTime(event.date)} - {formatEventEndTime(event.date, event.duration)}</div>
                      <div className="text-xs">{event.title}</div>
                    </motion.div>
                  ))
                ))}
              </div>
            </div>
          )
        })}
      </motion.div>
    )
  }

  const renderMonthView = () => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="border p-2 rounded-lg"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const events = getEventsForDate(year, month, i)
      days.push(
        <div key={i} className="border p-2 overflow-y-auto rounded-lg" style={{ height: '100px' }}>
          <div className="font-semibold mb-1">{i}</div>
          {events.map(event => (
            <div key={event.id} className={`${event.color} p-1 mb-1 rounded-lg text-xs`}>
              <div className="font-semibold">{formatEventTime(event.date)}</div>
              <div>{event.title}</div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <motion.div
        key={`${year}-${month}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-7 gap-1"
      >
        {days}
      </motion.div>
    )
  }

  const renderYearView = () => {
    return (
      <motion.div
        key={date.getFullYear()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 md:grid-cols-4 gap-4"
      >
        {months.map((month, index) => (
          <motion.div
            key={month}
            className="border p-2 rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <h3 className="font-semibold mb-2">{month}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDaysInMonth(date.getFullYear(), index) }, (_, i) => i + 1).map(day => {
                const events = getEventsForDate(date.getFullYear(), index, day)
                return (
                  <div key={day} className="text-center">
                    {events.length > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  const changeDate = (direction) => {
    setScrollDirection(direction)
    const newDate = new Date(date)
    if (view === 'day') newDate.setDate(date.getDate() + (direction === 'next' ? daysToShow : -daysToShow))
    else if (view === 'week') newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7))
    else if (view === 'month') newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1))
    else if (view === 'year') newDate.setFullYear(date.getFullYear() + (direction === 'next' ? 1 : -1))
    setDate(newDate)
  }

  const router = useRouter()
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, { withCredentials: true })
      .then((response) => { 
        if (response.status !== 200) {
          router.push('/')
        } else {
          // User is authenticated
        }
      }).catch((err) => { 
        router.push('/')
      })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={true} />
      <main className="flex-grow bg-white">
        <div className="sticky top-0 bg-white z-20">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex space-x-2">
              {['day', 'week', 'month', 'year'].map((v) => (
                <Button
                  key={v}
                  variant="outline"
                  size="sm"
                  onClick={() => setView(v)}
                  className={view === v ? 'bg-primary text-primary-foreground' : ''}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => changeDate('prev')} aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-semibold">
                {view === 'year' ? date.getFullYear() : date.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="outline" size="icon" onClick={() => changeDate('next')} aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {view === 'day' && (
            <div className="p-4">
              <Slider
                value={[daysToShow]}
                onValueChange={(value) => setDaysToShow(value[0])}
                max={7}
                min={1}
                step={1}
                className="w-48"
              />
              <span className="ml-2">Days: {daysToShow}</span>
            </div>
          )}
        </div>
        <div ref={contentRef} className="overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
          <AnimatePresence mode="wait">
            <div className="p-4">
              {view === 'day' && renderDayView()}
              {view === 'week' && renderWeekView()}
              {view === 'month' && renderMonthView()}
              {view === 'year' && renderYearView()}
            </div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}