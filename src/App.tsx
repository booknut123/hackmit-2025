import React, { useState, useEffect } from 'react';
import Homepage from './components/homepage/Homepage';
import JournalEntry from './components/journal-entry/JournalEntry';
import ChatInterface from './components/chat/ChatInterface';
import PatternInsights from './components/pattern-inights/PatternInsights';
import MoodVisualization from './components/mood/MoodVisualization';
import VoiceRecorder from './components/voice/VoiceRecorder';
import { UserProvider } from './context/UserContext';
import { Calendar, BookOpen, MessageCircle, BarChart, Mic, Smile } from 'lucide-react';
import './App.css';

// Define types
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface Cycle {
  startDate: Date;
  currentDay: number;
  phase: CyclePhase;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string | string[];
  symptoms: string[];
  cycleDay: number;
  notes: string;
  voice_note: string | null;
  content: string;
}

// Sample data - this would normally come from a database or API
const currentCycle: Cycle = {
  startDate: new Date(2025, 8, 1),
  currentDay: 13,
  phase: 'follicular',
};

const journalEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2025-09-13',
    mood: 'happy',
    symptoms: ['cramps'],
    cycleDay: 13,
    notes: 'Feeling good today.',
    voice_note: null,
    content: 'Feeling good today. Had some mild cramps this morning but they subsided after my walk.',
  },
  {
    id: '2',
    date: '2025-09-12',
    mood: ['energetic', 'positive'],
    symptoms: ['clear skin'],
    cycleDay: 12,
    notes: 'Great energy levels, perfect for my workout.',
    voice_note: null,
    content: 'Amazing energy today! Did a full HIIT workout and felt incredible. My skin is looking really clear too.',
  },
  {
    id: '3',
    date: '2025-09-11',
    mood: 'calm',
    symptoms: [],
    cycleDay: 11,
    notes: 'Peaceful day, did some yoga.',
    voice_note: null,
    content: 'Had a really peaceful day today. Did some gentle yoga in the morning and felt centered all day.',
  },
  {
    id: '4',
    date: '2025-09-10',
    mood: ['tired', 'overwhelmed'],
    symptoms: ['headache', 'bloating'],
    cycleDay: 10,
    notes: 'Rough day at work, feeling stressed.',
    voice_note: null,
    content: 'Work was really stressful today. Had a persistent headache and felt bloated. Need to practice more self-care.',
  },
  {
    id: '5',
    date: '2025-09-09',
    mood: 'excited',
    symptoms: ['increased appetite'],
    cycleDay: 9,
    notes: 'Looking forward to the weekend.',
    voice_note: null,
    content: 'Feeling really excited about weekend plans! Noticed I\'ve been hungrier than usual - probably hormonal.',
  }
];

const NAV_ITEMS = [
  { label: 'Calendar', key: 'calendar', icon: <Calendar /> },
  { label: 'Journal', key: 'journal', icon: <BookOpen /> },
  { label: 'Chat', key: 'chat', icon: <MessageCircle /> },
  { label: 'Insights', key: 'insights', icon: <BarChart /> },
  { label: 'Voice', key: 'voice', icon: <Mic /> },
  { label: 'Mood', key: 'mood', icon: <Smile /> },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState(() => {
    // Get saved tab from localStorage, but don't use it directly to avoid localStorage issues
    return 'calendar';
  });

  const [savedTab, setSavedTab] = useState<string>('calendar');

  // Load saved tab on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('activeTab');
      if (saved) {
        setSavedTab(saved);
        setActiveTab(saved);
      }
    } catch (error) {
      console.warn('LocalStorage not available, using default tab');
    }
  }, []);

  // Save active tab when it changes
  useEffect(() => {
    try {
      localStorage.setItem('activeTab', activeTab);
    } catch (error) {
      console.warn('Could not save to localStorage');
    }
  }, [activeTab]);

  let content;
  switch (activeTab) {
    case 'calendar':
      content = <Homepage currentCycle={currentCycle} journalEntries={journalEntries} />;
      break;
    case 'journal':
      content = <JournalEntry />;
      break;
    case 'chat':
      content = <ChatInterface currentCycle={currentCycle} journalEntries={journalEntries} />;
      break;
    case 'insights':
      content = <PatternInsights journalEntries={journalEntries} />;
      break;
    case 'voice':
      content = <VoiceRecorder />;
      break;
    case 'mood':
      content = <MoodVisualization journalEntries={journalEntries} />;
      break;
    default:
      content = <div>Select a section above.</div>;
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="page-title">Periodically.</h1>
        <div className="page-subtitle">Your cycle, your story, your insight</div>
      </header>

      <nav className="nav-tabs">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`tab ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {content}
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;