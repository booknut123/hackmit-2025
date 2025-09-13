import Homepage from './components/homepage/Homepage.tsx';

function App() {
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

  return <Homepage currentCycle={currentCycle} journalEntries={journalEntries} />;
}

export default App;
