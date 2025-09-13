import React, { useState } from 'react';
import Homepage from './components/homepage/Homepage';
import JournalEntry from './components/journal-entry/JournalEntry';
import ChatInterface from './components/chat/ChatInterface';
import PatternInsights from './components/pattern-inights/PatternInsights';
import MoodVisualization from './components/mood/MoodVisualization';
import VoiceRecorder from './components/voice/VoiceRecorder';
// Import other components as you build them

const NAV_ITEMS = [
  { label: 'Calendar', key: 'calendar' },
  { label: 'Journal', key: 'journal' },
  { label: 'Chat', key: 'chat' },
  { label: 'Insights', key: 'insights' },
  { label: 'Voice', key: 'voice' },
  { label: 'Mood', key: 'mood' },
];

function App() {
  const [activeTab, setActiveTab] = useState('journal');

  // Example mock data for props
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

  // Render the active component
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
    // Add cases for other components as you build them
    default:
      content = <div>Select a section above.</div>;
  }

  return (
    <div className="app-root" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f3e8ff 0%, #fff 100%)' }}>
      <header className="app-header" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h1 style={{ color: '#a21caf', fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.5rem' }}>Luna</h1>
        <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>Your personal cycle companion</div>
      </header>
      <nav className="app-nav" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            className={`nav-btn${activeTab === item.key ? ' active' : ''}`}
            style={{
              background: activeTab === item.key ? '#ede9fe' : 'transparent',
              color: activeTab === item.key ? '#a21caf' : '#374151',
              border: 'none',
              borderRadius: '1rem',
              padding: '0.75rem 1.5rem',
              fontWeight: 500,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main className="app-main" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1rem' }}>
        {content}
      </main>
    </div>
  );
}

export default App;