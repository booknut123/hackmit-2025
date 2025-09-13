import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Mic, MicOff, Play, Pause, Save, Trash2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

type JournalEntryType = {
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
  cycle_day: number;
  phase: string;
};

type VoiceRecorderProps = {
  onAddEntry: (entry: JournalEntryType) => void;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAddEntry }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recentRecordings, setRecentRecordings] = useState([
    {
      id: 1,
      date: '2024-12-13',
      duration: '02:34',
      transcription: "Today I'm feeling really energetic and happy. I went for a morning run and had a healthy breakfast. I notice my skin is looking clearer too, which always makes me feel more confident.",
      mood: 'happy',
      tags: ['energy', 'exercise', 'skin-health']
    },
    {
      id: 2,
      date: '2024-12-12',
      duration: '01:45',
      transcription: "Had some mild cramps this morning but they're manageable. I made some chamomile tea and did some gentle stretches which seemed to help.",
      mood: 'neutral',
      tags: ['cramps', 'self-care', 'remedies']
    }
  ]);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Simulate recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Simulate audio level fluctuation
        setAudioLevel(Math.random() * 100);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setTranscription('');
      setAudioBlob(null);
      toast.success('Recording started!');
    } catch (error) {
      toast.error('Could not start recording. Please check microphone permissions.');
    }
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Recording resumed' : 'Recording paused');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    
    // Simulate creating audio blob
    setAudioBlob(new Blob(['fake audio data'], { type: 'audio/wav' }));
    
    // Start transcription
    setIsTranscribing(true);
    
    // Simulate transcription delay
    setTimeout(() => {
      const mockTranscriptions = [
        "I'm feeling pretty good today, though I did wake up with a slight headache. I think it might be related to my cycle since I'm in my luteal phase. I've been drinking more water and it seems to be helping.",
        "Had a really emotional day today. I found myself crying at a commercial which is so unlike me, but I know this is normal for where I am in my cycle. I'm being gentle with myself and planning a relaxing evening.",
        "Woke up feeling incredibly energetic and motivated! I'm in my follicular phase and I can really feel the difference. I want to take advantage of this energy and tackle some projects I've been putting off.",
        "Dealing with some cramping today but overall my mood is good. I tried that heating pad technique and it really helped. Also noticed my appetite is different - craving more iron-rich foods.",
        "Really interesting pattern I'm noticing - my sleep quality seems to dip right before my period. I've been tracking it and there's definitely a correlation. Might try some magnesium supplements."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      setTranscription(randomTranscription);
      setIsTranscribing(false);
      toast.success('Transcription complete!');
    }, 3000);
  };

  const playAudio = () => {
    if (audioBlob) {
      setIsPlaying(!isPlaying);
      // Simulate audio playback
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const saveRecording = () => {
    if (!transcription) {
      toast.error('No transcription available to save');
      return;
    }

    // Auto-detect mood and tags from transcription
    const detectedMood = transcription.toLowerCase().includes('good') || transcription.toLowerCase().includes('energetic') 
      ? 'happy' 
      : transcription.toLowerCase().includes('emotional') || transcription.toLowerCase().includes('crying')
      ? 'sad'
      : 'neutral';

    const detectedTags = [];
    if (transcription.toLowerCase().includes('cramp')) detectedTags.push('cramps');
    if (transcription.toLowerCase().includes('energy')) detectedTags.push('energy');
    if (transcription.toLowerCase().includes('sleep')) detectedTags.push('sleep');
    if (transcription.toLowerCase().includes('mood')) detectedTags.push('mood');
    if (transcription.toLowerCase().includes('headache')) detectedTags.push('headache');

    const newRecording = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      duration: formatTime(recordingTime),
      transcription: transcription,
      mood: detectedMood,
      tags: detectedTags
    };

    setRecentRecordings(prev => [newRecording, ...prev]);

    // Create journal entry
    const journalEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: detectedMood,
      symptoms: detectedTags,
      notes: transcription,
      voice_note: transcription,
      cycle_day: 13,
      phase: 'follicular'
    };

    onAddEntry(journalEntry);

    // Reset recorder
    setRecordingTime(0);
    setAudioBlob(null);
    setTranscription('');
    
    toast.success('Voice note saved to journal!');
  };

  const deleteRecording = () => {
    setRecordingTime(0);
    setAudioBlob(null);
    setTranscription('');
    setIsRecording(false);
    setIsPaused(false);
    toast.info('Recording deleted');
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-700 border-green-300';
      case 'sad': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'neutral': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-purple-600" />
            Voice Recorder with Real-time Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Status */}
          <div className="text-center space-y-4">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 shadow-lg shadow-red-200 animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600'
            }`}>
              {isRecording ? (
                <MicOff className="h-12 w-12 text-white" />
              ) : (
                <Mic className="h-12 w-12 text-white" />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-mono">
                {formatTime(recordingTime)}
              </div>
              {isRecording && (
                <div className="text-sm text-muted-foreground">
                  {isPaused ? 'Paused' : 'Recording...'}
                </div>
              )}
            </div>

            {/* Audio Level Indicator */}
            {isRecording && !isPaused && (
              <div className="w-64 mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Audio Level</span>
                </div>
                <Progress value={audioLevel} className="h-2" />
              </div>
            )}

            {/* Recording Controls */}
            <div className="flex justify-center gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button
                    onClick={pauseRecording}
                    variant="outline"
                    className="px-6"
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={stopRecording}
                    className="bg-purple-600 hover:bg-purple-700 px-6"
                  >
                    Stop & Transcribe
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcription Results */}
      {(transcription || isTranscribing) && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Real-time Transcription</CardTitle>
          </CardHeader>
          <CardContent>
            {isTranscribing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-3">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground">Transcribing your voice note...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm leading-relaxed">"{transcription}"</p>
                </div>
                
                {/* Auto-detected elements */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Auto-detected Mood:</h4>
                    <Badge className={getMoodColor('happy')}>
                      Happy/Positive
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Auto-detected Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">#energy</Badge>
                      <Badge variant="outline">#self-awareness</Badge>
                      <Badge variant="outline">#cycle-tracking</Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={playAudio} variant="outline" className="flex-1">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Playing...' : 'Play Audio'}
                  </Button>
                  <Button onClick={saveRecording} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save to Journal
                  </Button>
                  <Button onClick={deleteRecording} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Recordings */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Voice Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRecordings.map((recording) => (
              <div key={recording.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getMoodColor(recording.mood)}>
                      {recording.mood}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{recording.date}</span>
                    <span className="text-sm text-muted-foreground">{recording.duration}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  "{recording.transcription}"
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {recording.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceRecorder;