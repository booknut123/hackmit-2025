import React, { useState } from 'react';
import './Homepage.css';
import { ChevronLeft, ChevronRight, Heart, Zap, Circle, Cloud, Calendar, BookOpen, MessageCircle, BarChart, Mic, Smile } from 'lucide-react';

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
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');
  const [userCycle, setUserCycle] = useState<Cycle>(currentCycle);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPeriodForm, setShowPeriodForm] = useState(false);

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
    if (!day || !userCycle?.startDate) return 'unknown';
    
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const timeDiff = dayDate.getTime() - userCycle.startDate.getTime();
    const daysSincePeriodStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Handle negative days (before period start) by finding the previous cycle
    if (daysSincePeriodStart < 0) {
      const cycleLength = 28; // Assume 28-day cycle
      const adjustedDays = ((daysSincePeriodStart % cycleLength) + cycleLength) % cycleLength;
      
      if (adjustedDays >= 23) return 'luteal'; // Late luteal phase before next period
      if (adjustedDays >= 16) return 'luteal';
      if (adjustedDays >= 14) return 'ovulatory';
      if (adjustedDays >= 6) return 'follicular';
      return 'menstrual';
    }
    
    const cycleDay = daysSincePeriodStart + 1;
    
    // Check if this day falls within the period duration
    if (periodEnd) {
      const endDate = new Date(periodEnd);
      const timeDiffEnd = dayDate.getTime() - endDate.getTime();
      const daysSinceEnd = Math.floor(timeDiffEnd / (1000 * 60 * 60 * 24));
      
      if (daysSincePeriodStart >= 0 && daysSinceEnd <= 0) {
        return 'menstrual';
      }
    } else {
      // Default to 5-day period if no end date specified
      if (cycleDay <= 5) return 'menstrual';
    }
    
    // For future cycles, repeat the pattern
    const normalizedDay = ((cycleDay - 1) % 28) + 1;
    
    if (normalizedDay <= 5) return 'menstrual';
    if (normalizedDay <= 13) return 'follicular';
    if (normalizedDay <= 15) return 'ovulatory';
    return 'luteal';
  };

  const getMoodForDay = (day: number | null): JournalEntry['mood'] | undefined => {
    if (!day) return undefined;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = journalEntries.find(e => e.date === dateStr);
    return entry?.mood;
  };

  const getMoodIcon = (mood: JournalEntry['mood'] | undefined): React.ReactElement | null => {
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

  const handleCycleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodStart) return;
    
    const start = new Date(periodStart);
    const today = new Date();
    const timeDiff = today.getTime() - start.getTime();
    const daysSincePeriodStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const cycleDay = daysSincePeriodStart + 1;
    
    let phase: CyclePhase = 'unknown';
    
    // Check if today is within the period duration
    if (periodEnd) {
      const end = new Date(periodEnd);
      if (today >= start && today <= end) {
        phase = 'menstrual';
      } else if (today > end) {
        const daysSinceEnd = Math.floor((today.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceEnd <= 8) phase = 'follicular';
        else if (daysSinceEnd <= 10) phase = 'ovulatory';
        else phase = 'luteal';
      }
    } else {
      // Default period length of 5 days
      if (cycleDay <= 5) phase = 'menstrual';
      else if (cycleDay <= 13) phase = 'follicular';
      else if (cycleDay <= 15) phase = 'ovulatory';
      else phase = 'luteal';
    }

    setUserCycle({
      startDate: start,
      currentDay: Math.max(1, cycleDay),
      phase: phase,
    });
    
    setShowPeriodForm(false);
  };

  const calculateNextPeriod = () => {
    if (!userCycle.startDate) return 'Unknown';
    const nextPeriodDate = new Date(userCycle.startDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + 28);
    return nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateFertileWindow = () => {
    if (!userCycle.startDate) return 'Unknown';
    const fertileStart = new Date(userCycle.startDate);
    const fertileEnd = new Date(userCycle.startDate);
    fertileStart.setDate(fertileStart.getDate() + 10);
    fertileEnd.setDate(fertileEnd.getDate() + 17);
    
    return `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();
  
  const timeDiff = today.getTime() - userCycle.startDate.getTime();
  const cycleDay = Math.max(1, Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1);

  const tabIcons = {
    Calendar: <Calendar />,
    Journal: <BookOpen />,
    Chat: <MessageCircle />,
    Insights: <BarChart />,
    Voice: <Mic />,
    Mood: <Smile />
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Luna</h1>
      <p className="page-subtitle">Your personal cycle companion</p>

      <div className="cycle-status">
        <div className="cycle-day">Day <strong>{cycleDay}</strong> of your cycle</div>
        <div className="cycle-phase">{userCycle.phase.charAt(0).toUpperCase() + userCycle.phase.slice(1)} Phase</div>
      </div>

      <div className="nav-tabs">
        {(['Calendar', 'Journal', 'Chat', 'Insights', 'Voice', 'Mood'] as const).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>

      {showPeriodForm && (
        <form className="cycle-form" onSubmit={handleCycleSubmit}>
          <label>
            Period Start Date:
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              required
            />
          </label>
          <label>
            Period End Date (Optional):
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </label>
          <div className="form-buttons">
            <button type="submit">Update Cycle</button>
            <button type="button" onClick={() => setShowPeriodForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {activeTab === 'Calendar' && (
        <div className="calendar-card">
          <div className="calendar-header-top">
            <h2 className="calendar-title">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="calendar-controls">
              <button 
                className="add-period-btn"
                onClick={() => {
                  console.log('Add Period button clicked'); // Debug log
                  setShowPeriodForm(true);
                }}
                type="button"
              >
                + Add Period
              </button>
              <div className="calendar-nav">
                <button onClick={() => navigateMonth(-1)} aria-label="Previous Month">
                  <ChevronLeft />
                </button>
                <button onClick={() => navigateMonth(1)} aria-label="Next Month">
                  <ChevronRight />
                </button>
              </div>
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
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              return (
                <div
                  key={day}
                  className={`day-cell ${phase} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span className={`mood-dot ${mood ? 'active' : ''}`}></span>
                  <span className="day-number">{day}</span>
                  {getMoodIcon(mood)}
                </div>
              );
            })}
          </div>

          <div className="cycle-info">
            <div><span>Cycle Day:</span> <strong>{cycleDay}</strong></div>
            <div><span>Phase:</span> <strong>{userCycle.phase.charAt(0).toUpperCase() + userCycle.phase.slice(1)}</strong></div>
            <div><span>Next Period:</span> <strong>{calculateNextPeriod()}</strong></div>
            <div><span>Fertile Window:</span> <strong>{calculateFertileWindow()}</strong></div>
          </div>

          {selectedDate && (
            <div className="journal-details show">
              <div className="journal-header">
                <h3>Details for {selectedDate}</h3>
                <button className="close-button" onClick={() => setSelectedDate(null)}>×</button>
              </div>
              {(() => {
                const entry = journalEntries.find(e => e.date === selectedDate);
                if (!entry) return <p>No journal entry for this day.</p>;
                return (
                  <div className="journal-entry">
                    <p><strong>Mood:</strong> {entry.mood}</p>
                    <p><strong>Symptoms:</strong> {entry.symptoms.join(', ') || 'None'}</p>
                    <p><strong>Notes:</strong> {entry.notes || 'No notes'}</p>
                    {entry.voice_note && <p><strong>Voice Note:</strong> {entry.voice_note}</p>}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;