import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Mic, Save, Smile, Heart, Zap, Cloud, Meh } from 'lucide-react';
import { toast } from 'sonner';

type Cycle = {
  startDate: Date;
  currentDay: number;
  phase: string;
};

type JournalEntryType = {
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
  cycle_day: number;
  phase: string;
};

type JournalEntryProps = {
  onAddEntry: (entry: JournalEntryType) => void;
  currentCycle: Cycle;
};

const JournalEntry: React.FC<JournalEntryProps> = ({ onAddEntry, currentCycle }) => {
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');

  const moods = [
    { id: 'happy', label: 'Happy', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300' },
    { id: 'energetic', label: 'Energetic', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { id: 'sad', label: 'Sad', icon: Cloud, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { id: 'anxious', label: 'Anxious', icon: Cloud, color: 'bg-purple-100 text-purple-700 border-purple-300' }
  ];

  const symptoms = [
    'cramps', 'bloating', 'headache', 'mood-swings', 'fatigue', 
    'breast-tenderness', 'acne', 'back-pain', 'nausea', 'food-cravings',
    'clear-skin', 'energetic', 'focused', 'happy', 'relaxed'
  ];

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    
    // Simulate recording with a timeout
    setTimeout(() => {
      setIsRecording(false);
      const transcription = "I'm feeling really good today. Had some mild cramps this morning but they went away after I had some tea. Planning to go for a walk later.";
      setVoiceNote(transcription);
      setNotes(prev => prev + (prev ? '\n\n' : '') + 'Voice note: ' + transcription);
      toast.success('Voice note recorded and transcribed!');
    }, 3000);
  };

  const handleSave = () => {
    if (!selectedMood && !notes && selectedSymptoms.length === 0) {
      toast.error('Please add at least a mood, note, or symptom');
      return;
    }

    const entry = {
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      symptoms: selectedSymptoms,
      notes: notes,
      voice_note: voiceNote,
      cycle_day: currentCycle.currentDay,
      phase: currentCycle.phase
    };

    onAddEntry(entry);
    
    // Reset form
    setNotes('');
    setSelectedMood('');
    setSelectedSymptoms([]);
    setVoiceNote('');
    
    toast.success('Journal entry saved!');
  };

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-purple-600" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {moods.map(mood => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    ${selectedMood === mood.id 
                      ? mood.color + ' scale-105 shadow-lg'
                      : 'bg-white border-gray-200 hover:scale-102 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Symptoms Tracking */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Track Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(symptom => (
              <Badge
                key={symptom}
                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105
                  ${selectedSymptoms.includes(symptom) 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-purple-50'
                  }
                `}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Recording */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-purple-600" />
            Voice Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={simulateVoiceRecording}
              disabled={isRecording}
              className={`
                w-full py-6 text-lg transition-all duration-200
                ${isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-purple-600 hover:bg-purple-700'
                }
              `}
            >
              <Mic className="h-5 w-5 mr-2" />
              {isRecording ? 'Recording... Speak now' : 'Start Voice Recording'}
            </Button>
            
            {voiceNote && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">Transcribed Voice Note:</h4>
                <p className="text-sm text-purple-700 italic">"{voiceNote}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Written Notes */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Notes & Thoughts</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How are you feeling? What's on your mind today? Any patterns you've noticed?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] resize-none bg-white/50 border-purple-200 focus:border-purple-400"
          />
        </CardContent>
      </Card>

      {/* Auto-tagging Preview */}
      {(notes || voiceNote) && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm">Auto-detected Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/50">
                #self-care
              </Badge>
              <Badge variant="outline" className="bg-white/50">
                #wellness
              </Badge>
              <Badge variant="outline" className="bg-white/50">
                #reflection
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Journal Entry
      </Button>
    </div>
  );
};

export default JournalEntry;