import React, { useState } from 'react';
import Homepage from './components/homepage/Homepage';
import JournalEntry from './components/journal-entry/JournalEntry';
import ChatInterface from './components/chat/ChatInterface';
import PatternInsights from './components/pattern-inights/PatternInsights';
import MoodVisualization from './components/mood/MoodVisualization';
import VoiceRecorder from './components/voice/VoiceRecorder';
import { Calendar, BookOpen, MessageCircle, BarChart, Mic, Smile } from 'lucide-react';
import './App.css';

const NAV_ITEMS = [
  { label: 'Calendar', key: 'calendar', icon: <Calendar /> },
  { label: 'Journal', key: 'journal', icon: <BookOpen /> },
  { label: 'Chat', key: 'chat', icon: <MessageCircle /> },
  { label: 'Insights', key: 'insights', icon: <BarChart /> },
  { label: 'Voice', key: 'voice', icon: <Mic /> },
  { label: 'Mood', key: 'mood', icon: <Smile /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('calendar');

  const currentCycle = {
    startDate: new Date(2025, 10, 1),
    currentDay: 13,
    phase: 'follicular',
  };

  const journalEntries = [
    {
      id: 1,
      date: '2025-11-13',
      mood: 'happy',
      symptoms: ['cramps'],
      notes: 'Feeling good today.',
      voice_note: null,
    },
  ];

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
        <h1 className="page-title">Luna</h1>
        <div className="page-subtitle">Your personal cycle companion</div>
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

export default App;
