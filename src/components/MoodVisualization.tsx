import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { Heart, TrendingUp, Calendar, Activity, Zap, Cloud, Smile, Frown } from 'lucide-react';

type Cycle = {
  startDate: Date;
  currentDay: number;
  phase: string;
};

type JournalEntry = {
  id?: number;
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
};

type MoodVisualizationProps = {
  journalEntries: JournalEntry[];
  currentCycle: Cycle;
};

const MoodVisualization: React.FC<MoodVisualizationProps> =  ({ journalEntries, currentCycle }) => {
  const [currentMood, setCurrentMood] = useState('happy');
  const [moodStreak, setMoodStreak] = useState(7);
  const [animatedValues, setAnimatedValues] = useState({
    happiness: 0,
    energy: 0,
    stress: 0,
    sleep: 0
  });

  // Mock real-time mood data
  const realtimeMoodData = [
    { time: '6:00', mood: 3, energy: 3, stress: 2 },
    { time: '9:00', mood: 4, energy: 4, stress: 3 },
    { time: '12:00', mood: 5, energy: 5, stress: 2 },
    { time: '15:00', mood: 4, energy: 4, stress: 3 },
    { time: '18:00', mood: 3, energy: 3, stress: 4 },
    { time: '21:00', mood: 4, energy: 2, stress: 2 }
  ];

  const cyclePhaseData = [
    { phase: 'Menstrual', mood: 2.8, energy: 2.5, wellbeing: 3.0 },
    { phase: 'Follicular', mood: 4.2, energy: 4.5, wellbeing: 4.3 },
    { phase: 'Ovulatory', mood: 4.8, energy: 5.0, wellbeing: 4.7 },
    { phase: 'Luteal', mood: 3.2, energy: 2.8, wellbeing: 3.5 }
  ];

  const weeklyTrendData = [
    { day: 'Mon', mood: 4, energy: 4, symptoms: 1 },
    { day: 'Tue', mood: 5, energy: 5, symptoms: 0 },
    { day: 'Wed', mood: 3, energy: 3, symptoms: 2 },
    { day: 'Thu', mood: 4, energy: 4, symptoms: 1 },
    { day: 'Fri', mood: 5, energy: 5, symptoms: 0 },
    { day: 'Sat', mood: 4, energy: 3, symptoms: 1 },
    { day: 'Sun', mood: 4, energy: 4, symptoms: 1 }
  ];

  const moodFactors = [
    { factor: 'Sleep Quality', current: 85, optimal: 90, trend: 'up' },
    { factor: 'Exercise', current: 70, optimal: 80, trend: 'up' },
    { factor: 'Stress Level', current: 30, optimal: 20, trend: 'down' },
    { factor: 'Social Connection', current: 75, optimal: 85, trend: 'stable' },
    { factor: 'Nutrition', current: 80, optimal: 85, trend: 'up' }
  ];

  const emotionalPatterns = [
    { emotion: 'Joy', value: 4.2, color: '#22c55e', icon: Smile },
    { emotion: 'Anxiety', value: 2.1, color: '#f59e0b', icon: Cloud },
    { emotion: 'Sadness', value: 1.8, color: '#3b82f6', icon: Frown },
    { emotion: 'Energy', value: 4.5, color: '#8b5cf6', icon: Zap },
    { emotion: 'Calm', value: 3.8, color: '#06b6d4', icon: Heart }
  ];

  // Animate values on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        happiness: 85,
        energy: 70,
        stress: 30,
        sleep: 88
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'energetic': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'neutral': return <Activity className="h-5 w-5 text-gray-500" />;
      case 'sad': return <Cloud className="h-5 w-5 text-blue-500" />;
      default: return <Heart className="h-5 w-5 text-pink-500" />;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
    return <Activity className="h-3 w-3 text-gray-500" />;
  };

  const getPulseAnimation = (value) => {
    if (value > 80) return 'animate-pulse';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Current Mood Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-700">Current Mood</p>
                <p className="text-2xl font-bold text-pink-800 capitalize">{currentMood}</p>
              </div>
              <div className={`p-3 bg-white/50 rounded-full ${getPulseAnimation(85)}`}>
                {getMoodIcon(currentMood)}
              </div>
            </div>
            <div className="mt-4">
              <Progress value={animatedValues.happiness} className="h-2" />
              <p className="text-xs text-pink-600 mt-1">Happiness: {animatedValues.happiness}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Energy Level</p>
                <p className="text-2xl font-bold text-yellow-800">{animatedValues.energy}%</p>
              </div>
              <div className={`p-3 bg-white/50 rounded-full ${getPulseAnimation(70)}`}>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={animatedValues.energy} className="h-2" />
              <p className="text-xs text-yellow-600 mt-1">Above average for cycle day</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Stress Level</p>
                <p className="text-2xl font-bold text-blue-800">{animatedValues.stress}%</p>
              </div>
              <div className={`p-3 bg-white/50 rounded-full ${getPulseAnimation(30)}`}>
                <Cloud className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={animatedValues.stress} className="h-2" />
              <p className="text-xs text-blue-600 mt-1">Low stress day!</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Sleep Quality</p>
                <p className="text-2xl font-bold text-purple-800">{animatedValues.sleep}%</p>
              </div>
              <div className={`p-3 bg-white/50 rounded-full ${getPulseAnimation(88)}`}>
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={animatedValues.sleep} className="h-2" />
              <p className="text-xs text-purple-600 mt-1">Excellent sleep streak!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Mood Timeline */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Today's Mood Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={realtimeMoodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[1, 5]} />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'mood' ? 'Mood' : name === 'energy' ? 'Energy' : 'Stress'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="#a855f7" 
                fill="#a855f7" 
                fillOpacity={0.3}
                name="mood"
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.3}
                name="energy"
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="stress"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Emotional Spectrum */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Emotional Spectrum Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {emotionalPatterns.map((pattern) => {
              const Icon = pattern.icon;
              return (
                <div key={pattern.emotion} className="text-center space-y-3">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: pattern.color + '20', border: `2px solid ${pattern.color}` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: pattern.color }} />
                  </div>
                  <div>
                    <h4 className="font-medium">{pattern.emotion}</h4>
                    <p className="text-sm text-muted-foreground">{pattern.value}/5</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(pattern.value / 5) * 100}%`,
                        backgroundColor: pattern.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cycle Phase Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Mood by Cycle Phase</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={cyclePhaseData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="phase" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar 
                  name="Mood" 
                  dataKey="mood" 
                  stroke="#a855f7" 
                  fill="#a855f7" 
                  fillOpacity={0.3}
                />
                <Radar 
                  name="Energy" 
                  dataKey="energy" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mood Influencing Factors */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Factors Influencing Your Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodFactors.map((factor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{factor.factor}</span>
                    {getTrendIcon(factor.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {factor.current}% / {factor.optimal}%
                    </span>
                    <Badge 
                      variant={factor.current >= factor.optimal ? "default" : "outline"}
                      className={factor.current >= factor.optimal ? "bg-green-600" : ""}
                    >
                      {factor.current >= factor.optimal ? "Optimal" : "Needs attention"}
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={factor.current} className="h-3" />
                  <div 
                    className="absolute top-0 h-3 w-0.5 bg-gray-400"
                    style={{ left: `${factor.optimal}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-2">🌟 Current Streak</h4>
              <p className="text-sm text-muted-foreground">
                {moodStreak} days of positive mood! You're in your follicular phase sweet spot.
              </p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">💪 Strength Pattern</h4>
              <p className="text-sm text-muted-foreground">
                Your energy peaks around day 10-14. Perfect timing for big projects!
              </p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">🔄 Upcoming Changes</h4>
              <p className="text-sm text-muted-foreground">
                Expect energy to dip around day 21. Plan relaxing activities then.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodVisualization;