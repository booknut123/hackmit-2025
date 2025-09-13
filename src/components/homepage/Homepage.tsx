import React, { useState } from 'react';
import './Homepage.css';
import { ChevronLeft, ChevronRight, Heart, Zap, Circle, Cloud } from 'lucide-react';

type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';

interface Cycle {
  startDate: Date;
  currentDay: number;
  phase: CyclePhase;
}

interface JournalEntry {
  id?: number;
  date: string;
  mood: 'happy' | 'energetic' | 'neutral' | 'sad';
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
}

interface HomepageProps {
  currentCycle: Cycle;
  journalEntries: JournalEntry[];
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Homepage: React.FC<HomepageProps> = ({ currentCycle, journalEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Calendar');

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

  const getCyclePhase = (day: number | null): CyclePhase => {
    if (!day || !currentCycle?.startDate) return 'unknown';
    const cycleDay = ((day - currentCycle.startDate.getDate() + 28) % 28) + 1;
    if (cycleDay <= 5) return 'menstrual';
    if (cycleDay <= 13) return 'follicular';
    if (cycleDay <= 15) return 'ovulatory';
    if (cycleDay <= 28) return 'luteal';
    return 'unknown';
  };

  const getMoodForDay = (day: number | null): JournalEntry['mood'] | undefined => {
    if (!day) return undefined;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = journalEntries.find(e => e.date === dateStr);
    return entry?.mood;
  };

  const getMoodIcon = (mood: JournalEntry['mood'] | undefined): JSX.Element | null => {
    switch (mood) {
      case 'happy': return <Heart className="mood-icon happy" />;
      case 'energetic': return <Zap className="mood-icon energetic" />;
      case 'neutral': return <Circle className="mood-icon neutral" />;
      case 'sad': return <Cloud className="mood-icon sad" />;
      default: return null;
    }
  };

  const navigateMonth = (direction: number): void => {
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
  const cycleDay = ((today.getDate() - currentCycle.startDate.getDate() + 28) % 28) + 1;

  return (
    <div className="page-container">
      <h1 className="page-title">Luna</h1>
      <p className="page-subtitle">Your personal cycle companion</p>

      <div className="nav-tabs">
        {['Calendar', 'Journal', 'Chat', 'Insights', 'Voice', 'Mood'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Calendar' && (
        <div className="calendar-card">
          <div className="calendar-header-top">
            <h2 className="calendar-title">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="calendar-nav">
              <button onClick={() => navigateMonth(-1)} aria-label="Previous Month">
                <ChevronLeft />
              </button>
              <button onClick={() => navigateMonth(1)} aria-label="Next Month">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="calendar-legend">
            <span className="badge menstrual">Menstrual</span>
            <span className="badge follicular">Follicular</span>
            <span className="badge ovulatory">Ovulatory</span>
            <span className="badge luteal">Luteal</span>
          </div>

          <div className="calendar-days">
            {daysOfWeek.map((d) => (
              <div key={d} className="day-label">{d}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} className="day-empty"></div>;
              const phase = getCyclePhase(day);
              const mood = getMoodForDay(day);
              const isToday = isCurrentMonth && day === today.getDate();
              return (
                <div key={day} className={`day-cell ${phase} ${isToday ? 'today' : ''}`}>
                  <span className={`mood-dot ${mood ? 'active' : ''}`}></span>
                  <span className="day-number">{day}</span>
                  {getMoodIcon(mood)}
                </div>
              );
            })}
          </div>

          <div className="cycle-info">
            <div><span>Cycle Day:</span> <strong>{cycleDay}</strong></div>
            <div><span>Phase:</span> <strong>{getCyclePhase(today.getDate())}</strong></div>
            <div><span>Next Period:</span> <strong>Dec 29</strong></div>
            <div><span>Fertile Window:</span> <strong>Dec 17–22</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
