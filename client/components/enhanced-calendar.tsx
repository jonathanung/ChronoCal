"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Simulated API call
const fetchEvents = async (year: number, month: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate random events for the month
  const events = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    if (Math.random() > 0.7) {
      events.push({
        id: `event-${year}-${month}-${i}`,
        title: `Event on ${i}/${month + 1}`,
        date: new Date(year, month, i),
        description: `This is a random event generated for ${i}/${month + 1}/${year}`,
        color: `bg-${['blue', 'red', 'green', 'yellow', 'purple', 'pink'][Math.floor(Math.random() * 6)]}-200`
      })
    }
  }
  return events
}

type Event = {
  id: string
  title: string
  date: Date
  description: string
  color: string
}

export function EnhancedCalendar() {
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState('month')
  const [weeks, setWeeks] = useState(1)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const getEventsForDate = (year: number, month: number, day: number) => {
    return events.filter(event => 
      event.date.getFullYear() === year &&
      event.date.getMonth() === month &&
      event.date.getDate() === day
    )
  }

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const newEvents = await fetchEvents(date.getFullYear(), date.getMonth())
      setEvents(newEvents)
      setLoading(false)
    }
    loadEvents()
  }, [date])

  const renderDayView = () => {
    const dayEvents = getEventsForDate(date.getFullYear(), date.getMonth(), date.getDate())
    return (
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-4">{format(date, 'MMMM d, yyyy')}</h3>
        <div className="flex-grow overflow-y-auto">
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`${event.color} p-2 mb-2 rounded-lg cursor-pointer`}
              onClick={() => setSelectedEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const days = []

    for (let i = 0; i < 7 * weeks; i++) {
      const currentDate = new Date(startOfWeek)
      currentDate.setDate(startOfWeek.getDate() + i)
      const dayEvents = getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      days.push(
        <div key={i} className="border p-2">
          <div className="font-semibold">{format(currentDate, 'd')}</div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`${event.color} p-1 mb-1 rounded text-sm cursor-pointer`}
              onClick={() => setSelectedEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1 overflow-y-auto" style={{height: `calc(100% - 60px)`}}>
        {days}
      </div>
    )
  }

  const renderMonthView = () => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="border p-2"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayEvents = getEventsForDate(year, month, i)
      days.push(
        <div key={i} className="border p-2 overflow-y-auto" style={{height: '100px'}}>
          <div className="font-semibold">{i}</div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`${event.color} p-1 mb-1 rounded text-sm cursor-pointer`}
              onClick={() => setSelectedEvent(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    )
  }

  const renderYearView = () => {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map((month, index) => (
          <div key={month} className="border p-2">
            <h3 className="font-semibold mb-2">{month}</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({length: getDaysInMonth(date.getFullYear(), index)}, (_, i) => i + 1).map(day => {
                const dayEvents = getEventsForDate(date.getFullYear(), index, day)
                return (
                  <div key={day} className="text-center">
                    {dayEvents.length > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(date)
    if (view === 'day') newDate.setDate(date.getDate() + (direction === 'next' ? 1 : -1))
    else if (view === 'week') newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7))
    else if (view === 'month') newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1))
    else if (view === 'year') newDate.setFullYear(date.getFullYear() + (direction === 'next' ? 1 : -1))
    setDate(newDate)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') changeDate('prev')
      else if (e.key === 'ArrowRight') changeDate('next')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [date, view])

  useEffect(() => {
    let startX: number
    let startY: number

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) changeDate('next')
        else changeDate('prev')
      }
    }

    const calendarElement = calendarRef.current
    if (calendarElement) {
      calendarElement.addEventListener('touchstart', handleTouchStart)
      calendarElement.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener('touchstart', handleTouchStart)
        calendarElement.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [date, view])

  return (
    <div className="flex flex-col h-screen bg-white">
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
            {view === 'year' ? date.getFullYear() : format(date, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={() => changeDate('next')} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Jump to date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {view === 'week' && (
        <div className="p-4">
          <Slider
            value={[weeks]}
            onValueChange={(value) => setWeeks(value[0])}
            max={6}
            min={1}
            step={1}
            className="w-48"
          />
          <span className="ml-2">Weeks: {weeks}</span>
        </div>
      )}
      <div ref={calendarRef} className="flex-grow overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
            {view === 'year' && renderYearView()}
          </>
        )}
      </div>
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              <p><strong>Date:</strong> {selectedEvent?.date.toLocaleDateString()}</p>
              <p><strong>Description:</strong> {selectedEvent?.description}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}