import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Heart, Zap, Circle, Cloud } from 'lucide-react';

type Cycle = {
  startDate: Date;
  currentDay: number;
  phase: string;
};

type JournalEntry = {
  id?: number;
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
};

type CalendarProps = {
  currentCycle: Cycle;
  journalEntries: JournalEntry[];
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const phaseColors: Record<string, string> = {
  menstrual: 'bg-red-50 border-red-200',
  follicular: 'bg-green-50 border-green-200',
  ovulatory: 'bg-yellow-50 border-yellow-200',
  luteal: 'bg-purple-50 border-purple-200',
  unknown: 'bg-gray-50 border-gray-200'
};

const phaseBadges: Record<string, string> = {
  menstrual: 'bg-red-100 text-red-700',
  follicular: 'bg-green-100 text-green-700',
  ovulatory: 'bg-yellow-100 text-yellow-700',
  luteal: 'bg-purple-100 text-purple-700'
};

const Calendar: React.FC<CalendarProps> = ({ currentCycle, journalEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  // Clamp cycle day to positive and handle before start
  const getCyclePhase = (day: number | null): string => {
    if (!day || !currentCycle || !currentCycle.startDate) return 'unknown';
    const cycleDay = ((day - currentCycle.startDate.getDate() + 28) % 28) + 1;
    if (cycleDay <= 5) return 'menstrual';
    if (cycleDay <= 13) return 'follicular';
    if (cycleDay <= 15) return 'ovulatory';
    if (cycleDay <= 28) return 'luteal';
    return 'unknown';
  };

  const getMoodForDay = (day: number | null): string | undefined => {
    if (!day) return undefined;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = journalEntries.find(e => e.date === dateStr);
    return entry?.mood;
  };

  const getMoodIcon = (mood: string | undefined): React.JSX.Element | null => {
    switch (mood) {
      case 'happy': return <Heart className="h-3 w-3 text-pink-500" />;
      case 'energetic': return <Zap className="h-3 w-3 text-yellow-500" />;
      case 'neutral': return <Circle className="h-3 w-3 text-gray-500" />;
      case 'sad': return <Cloud className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  // Calculate cycle day for today
  const cycleDay = ((today.getDate() - currentCycle.startDate.getDate() + 28) % 28) + 1;
  const phase = getCyclePhase(today.getDate());

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-full hover:bg-muted transition"
              onClick={() => navigateMonth(-1)}
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-muted transition"
              onClick={() => navigateMonth(1)}
              aria-label="Next Month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Legend */}
        <div className="flex gap-3 mt-4">
          <Badge className={phaseBadges.menstrual}>Menstrual</Badge>
          <Badge className={phaseBadges.follicular}>Follicular</Badge>
          <Badge className={phaseBadges.ovulatory}>Ovulatory</Badge>
          <Badge className={phaseBadges.luteal}>Luteal</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-xs text-muted-foreground text-center font-medium">{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="p-2 min-h-[3rem]"></div>;
            }
            const phase = getCyclePhase(day);
            const mood = getMoodForDay(day);
            const isToday = isCurrentMonth && day === today.getDate();
            return (
              <div
                key={day}
                className={`relative p-2 min-h-[3rem] rounded-xl border flex flex-col items-center justify-center transition
                  ${phaseColors[phase] || phaseColors.unknown}
                  ${isToday ? 'border-2 border-purple-500 font-bold text-purple-700' : ''}
                `}
              >
                {/* Mood dot */}
                <span className={`absolute top-1 left-1 w-2 h-2 rounded-full ${mood ? 'bg-purple-400' : 'bg-gray-300'}`}></span>
                {/* Day number */}
                <span className={`font-semibold ${isToday ? 'text-purple-700' : ''}`}>{day}</span>
                {/* Mood icon */}
                <span className="absolute bottom-1 right-1">{getMoodIcon(mood)}</span>
              </div>
            );
          })}
        </div>
        {/* Current Cycle Info */}
        <div className="mt-6 p-4 rounded-xl bg-white/60 border text-sm flex flex-col gap-2">
          <div>
            <span className="font-medium text-muted-foreground">Cycle Day:</span>
            <span className="ml-2 font-semibold">{cycleDay}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Phase:</span>
            <span className="ml-2 font-semibold capitalize">{getCyclePhase(today.getDate())}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Next Period:</span>
            <span className="ml-2 font-semibold">Dec 29</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Fertile Window:</span>
            <span className="ml-2 font-semibold">Dec 17-22</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;