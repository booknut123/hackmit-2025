import React, { useState } from 'react';
import './JournalEntry.css';

const moods = [
  { label: 'Happy', icon: '❤️', value: 'happy' },
  { label: 'Energetic', icon: '⚡', value: 'energetic' },
  { label: 'Neutral', icon: '🙂', value: 'neutral' },
  { label: 'Sad', icon: '☁️', value: 'sad' },
  { label: 'Anxious', icon: '☁️', value: 'anxious' },
];

const symptoms = [
  'cramps', 'bloating', 'headache', 'mood swings', 'fatigue', 'breast tenderness',
  'acne', 'back pain', 'nausea', 'food cravings', 'clear skin', 'energetic',
  'focused', 'happy', 'relaxed'
];

export default function JournalEntry() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [voiceNote, setVoiceNote] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="journal-container">
      {/* Mood Selection */}
      <div className="journal-section">
        <div className="journal-section-title">
          <span role="img" aria-label="smile" className="journal-icon">😊</span>
          How are you feeling today?
        </div>
        <div className="mood-options">
          {moods.map(mood => (
            <button
              key={mood.value}
              className={`mood-card${selectedMood === mood.value ? ' selected' : ''}`}
              onClick={() => setSelectedMood(mood.value)}
              type="button"
            >
              <span className={`mood-card-icon`}>{mood.icon}</span>
              <span className="mood-card-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="journal-section">
        <div className="journal-section-title">Track Symptoms</div>
        <div className="symptom-tags">
          {symptoms.map(symptom => (
            <button
              key={symptom}
              className={`symptom-tag${selectedSymptoms.includes(symptom) ? ' active' : ''}`}
              onClick={() => toggleSymptom(symptom)}
              type="button"
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Note */}
      <div className="journal-section">
        <div className="journal-section-title">
          <span role="img" aria-label="mic" className="journal-icon">🎤</span>
          Voice Note
        </div>
        <button className="voice-record-btn" type="button">
          <span role="img" aria-label="mic" className="voice-record-icon">🎤</span>
          Start Voice Recording
        </button>
        <div className="voice-progress-bar"></div>
      </div>

      {/* Notes */}
      <div className="journal-section">
        <div className="journal-section-title">Notes & Thoughts</div>
        <textarea
          className="notes-input"
          placeholder="How are you feeling? What's on your mind today? Any patterns you've noticed?"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
}