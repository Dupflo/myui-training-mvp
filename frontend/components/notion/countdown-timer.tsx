"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface CountdownTimerProps {
  startDate: string
  endDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  startDate,
  endDate,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Parse dates (assuming format is DD-MM-YYYY)
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-").map(Number)
      return new Date(year, month - 1, day) // Month is 0-indexed in JS Date
    }

    const start = parseDate(startDate)
    const end = parseDate(endDate)
    const now = new Date()

    // Check if countdown should be active
    if (now < start) {
      // Countdown hasn't started yet
      setIsActive(false)
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    if (now > end) {
      // Countdown has ended
      setIsActive(false)
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    // Start the countdown
    const intervalId = setInterval(() => {
      const now = new Date()
      const difference = end.getTime() - now.getTime()

      if (difference <= 0) {
        // Countdown has ended
        clearInterval(intervalId)
        setIsActive(false)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [startDate, endDate])

  if (!isActive) {
    if (new Date() < new Date(startDate.split("-").reverse().join("-"))) {
      return <div className="text-center">Countdown will start soon</div>
    } else {
      return <div className="text-center">Countdown has ended</div>
    }
  }

  return (
    <div className="flex my-5 flex-col items-center justify-center p-4 bg-block w-full bg-black rounded-lg text-white shadow-lg">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-sm">Jours</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm">Heures</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm">Minutes</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm">Secondes</div>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
