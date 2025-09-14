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
    content: 'Feeling good today.',
  },
  {
    id: '2',
    date: '2025-09-12',
    mood: ['energetic', 'positive'],
    symptoms: ['clear skin'],
    cycleDay: 12,
    notes: 'Great energy levels, perfect for my workout.',
    voice_note: null,
    content: 'Great energy levels, perfect for my workout.',
  },
  {
    id: '3',
    date: '2025-09-11',
    mood: 'calm',
    symptoms: [],
    cycleDay: 11,
    notes: 'Peaceful day, did some yoga.',
    voice_note: null,
    content: 'Peaceful day, did some yoga.',
  },
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
    // Persist active tab in localStorage
    return localStorage.getItem('activeTab') || 'calendar';
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
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