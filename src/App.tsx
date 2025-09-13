import React, { useState } from 'react';
import './styles/globals.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Calendar, MessageCircle, BarChart3, Mic, Heart, BookOpen } from 'lucide-react';
import CalendarComponent from './components/Calendar';
import JournalEntry from './components/JournalEntry';
import ChatInterface from './components/ChatInterface';
import PatternInsights from './components/PatternInsights';
import VoiceRecorder from './components/VoiceRecorder';
import MoodVisualization from './components/MoodVisualization';

export default function App() {
  const [currentCycle, setCurrentCycle] = useState({
    startDate: new Date(2024, 11, 1), // December 1, 2024
    currentDay: 13,
    phase: 'follicular'
  });

  const [journalEntries, setJournalEntries] = useState([
    {
      id: 1,
      date: '2024-12-13',
      mood: 'happy',
      symptoms: ['energetic', 'clear-skin'],
      notes: 'Feeling great today! Had a good workout and feeling energized.',
      voice_note: 'Just wanted to record that I had an amazing day...'
    },
    {
      id: 2,
      date: '2024-12-12',
      mood: 'neutral',
      symptoms: ['mild-cramps', 'bloating'],
      notes: 'Some mild discomfort but manageable.',
      voice_note: null
    }
  ]);

  const addJournalEntry = (entry) => {
    setJournalEntries(prev => [...prev, { ...entry, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Luna
          </h1>
          <p className="text-muted-foreground">Your personal cycle companion</p>
          <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl inline-block">
            <p className="text-sm">Day <span className="font-semibold text-purple-600">{currentCycle.currentDay}</span> of your cycle</p>
            <p className="text-xs text-muted-foreground capitalize">{currentCycle.phase} phase</p>
          </div>
        </header>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="calendar" className="flex flex-col gap-1 py-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex flex-col gap-1 py-3">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex flex-col gap-1 py-3">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex flex-col gap-1 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex flex-col gap-1 py-3">
              <Mic className="h-4 w-4" />
              <span className="text-xs">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex flex-col gap-1 py-3">
              <Heart className="h-4 w-4" />
              <span className="text-xs">Mood</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-0">
            <CalendarComponent 
              currentCycle={currentCycle} 
              journalEntries={journalEntries}
            />
          </TabsContent>

          <TabsContent value="journal" className="mt-0">
            <JournalEntry 
              onAddEntry={addJournalEntry}
              currentCycle={currentCycle}
            />
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <ChatInterface 
              journalEntries={journalEntries}
              currentCycle={currentCycle}
            />
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <PatternInsights journalEntries={journalEntries} />
          </TabsContent>

          <TabsContent value="voice" className="mt-0">
            <VoiceRecorder onAddEntry={addJournalEntry} />
          </TabsContent>

          <TabsContent value="mood" className="mt-0">
            <MoodVisualization 
              journalEntries={journalEntries}
              currentCycle={currentCycle}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}