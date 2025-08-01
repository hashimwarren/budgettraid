"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DaySelectorProps {
  onDayChange?: (day: string) => void;
}

const DAYS = ['Today', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function DaySelector({ onDayChange }: DaySelectorProps) {
  const [selectedDay, setSelectedDay] = useState<string>('Today');

  // Load saved day from localStorage on mount
  useEffect(() => {
    const savedDay = localStorage.getItem('selectedDay');
    if (savedDay && DAYS.includes(savedDay)) {
      setSelectedDay(savedDay);
    }
  }, []);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    localStorage.setItem('selectedDay', day);
    onDayChange?.(day);
  };

  return (
    <div className="w-full" data-testid="day-selector">
      <label htmlFor="day-select" className="block text-sm font-medium text-foreground mb-2">
        Select Day
      </label>
      <Select value={selectedDay} onValueChange={handleDaySelect}>
        <SelectTrigger id="day-select" className="w-full">
          <SelectValue placeholder="Select a day" />
        </SelectTrigger>
        <SelectContent>
          {DAYS.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
