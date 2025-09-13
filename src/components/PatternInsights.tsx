import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity, Calendar, Clock } from 'lucide-react';


type JournalEntry = {
  id?: number;
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
};

type PatternInsightsProps = {
  journalEntries: JournalEntry[];
};

const PatternInsights: React.FC<PatternInsightsProps> = ({ journalEntries }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');

  // Mock data for comprehensive visualizations
  const moodTrendsData = [
    { day: 1, mood: 3, phase: 'menstrual', energy: 2 },
    { day: 3, mood: 2, phase: 'menstrual', energy: 2 },
    { day: 5, mood: 3, phase: 'menstrual', energy: 3 },
    { day: 8, mood: 4, phase: 'follicular', energy: 4 },
    { day: 10, mood: 5, phase: 'follicular', energy: 5 },
    { day: 12, mood: 4, phase: 'follicular', energy: 4 },
    { day: 14, mood: 5, phase: 'ovulatory', energy: 5 },
    { day: 16, mood: 4, phase: 'ovulatory', energy: 4 },
    { day: 18, mood: 3, phase: 'luteal', energy: 3 },
    { day: 21, mood: 2, phase: 'luteal', energy: 2 },
    { day: 24, mood: 2, phase: 'luteal', energy: 2 },
    { day: 26, mood: 3, phase: 'luteal', energy: 3 },
    { day: 28, mood: 2, phase: 'luteal', energy: 2 }
  ];

  const symptomFrequencyData = [
    { symptom: 'Cramps', count: 8, phase: 'menstrual' },
    { symptom: 'Bloating', count: 12, phase: 'luteal' },
    { symptom: 'Headache', count: 6, phase: 'luteal' },
    { symptom: 'Mood Swings', count: 9, phase: 'luteal' },
    { symptom: 'Fatigue', count: 10, phase: 'menstrual' },
    { symptom: 'Acne', count: 7, phase: 'luteal' },
    { symptom: 'Breast Tenderness', count: 8, phase: 'luteal' }
  ];

  const cycleConsistencyData = [
    { month: 'Sep', length: 28, moodAvg: 3.2 },
    { month: 'Oct', length: 30, moodAvg: 3.5 },
    { month: 'Nov', length: 27, moodAvg: 3.8 },
    { month: 'Dec', length: 29, moodAvg: 3.6 }
  ];

  const correlationHeatmapData = [
    { factor: 'Sleep Quality', mood: 0.8, energy: 0.9, symptoms: -0.6 },
    { factor: 'Exercise', mood: 0.7, energy: 0.8, symptoms: -0.5 },
    { factor: 'Stress Level', mood: -0.6, energy: -0.7, symptoms: 0.8 },
    { factor: 'Caffeine', mood: 0.3, energy: 0.4, symptoms: 0.2 },
    { factor: 'Water Intake', mood: 0.5, energy: 0.6, symptoms: -0.4 }
  ];

  const phaseDistribution = [
    { name: 'Menstrual', value: 18, color: '#ef4444' },
    { name: 'Follicular', value: 32, color: '#22c55e' },
    { name: 'Ovulatory', value: 15, color: '#eab308' },
    { name: 'Luteal', value: 35, color: '#a855f7' }
  ];

  const COLORS = ['#ef4444', '#22c55e', '#eab308', '#a855f7'];

  const getCorrelationColor = (value) => {
    if (value > 0.6) return 'bg-green-500';
    if (value > 0.3) return 'bg-yellow-500';
    if (value > -0.3) return 'bg-gray-300';
    if (value > -0.6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCorrelationIntensity = (value) => {
    const intensity = Math.abs(value);
    if (intensity > 0.7) return 'opacity-100';
    if (intensity > 0.5) return 'opacity-80';
    if (intensity > 0.3) return 'opacity-60';
    return 'opacity-40';
  };

  return (
    <div className="space-y-6">
      {/* Header with Timeframe Selection */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Pattern Insights
            </CardTitle>
            <div className="flex gap-2">
              {['1month', '3months', '6months'].map(period => (
                <Badge
                  key={period}
                  variant={selectedTimeframe === period ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTimeframe === period 
                      ? 'bg-purple-600' 
                      : 'hover:bg-purple-50'
                  }`}
                  onClick={() => setSelectedTimeframe(period)}
                >
                  {period === '1month' ? '1M' : period === '3months' ? '3M' : '6M'}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mood-trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="mood-trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Mood Trends
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Symptoms
          </TabsTrigger>
          <TabsTrigger value="cycle-health" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Cycle Health
          </TabsTrigger>
          <TabsTrigger value="correlations" className="flex items-center gap-2">
            <PieIcon className="h-4 w-4" />
            Correlations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood-trends">
          <div className="grid gap-6">
            {/* Mood & Energy Over Cycle */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Mood & Energy Throughout Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={moodTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip 
                      labelFormatter={(value) => `Day ${value}`}
                      formatter={(value, name) => [
                        value,
                        name === 'mood' ? 'Mood' : 'Energy'
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
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.3}
                      name="energy"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle>Key Mood Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-green-700">Peak Energy</h4>
                    <p className="text-sm text-muted-foreground">Days 8-14 (Follicular/Ovulatory)</p>
                    <p className="text-xs mt-1">Best time for important tasks</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-yellow-700">Mood Dips</h4>
                    <p className="text-sm text-muted-foreground">Days 21-26 (Late Luteal)</p>
                    <p className="text-xs mt-1">Plan extra self-care</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-purple-700">Recovery</h4>
                    <p className="text-sm text-muted-foreground">Days 5-7 (Late Menstrual)</p>
                    <p className="text-xs mt-1">Mood starts improving</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="symptoms">
          <div className="grid gap-6">
            {/* Symptom Frequency */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Most Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={symptomFrequencyData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="symptom" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Symptom Timeline */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Symptom Patterns by Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-700 mb-2">Menstrual</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Cramps (75%)</li>
                      <li>• Fatigue (60%)</li>
                      <li>• Lower back pain (40%)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-700 mb-2">Follicular</h4>
                    <ul className="text-sm space-y-1">
                      <li>• High energy (80%)</li>
                      <li>• Clear skin (65%)</li>
                      <li>• Good mood (70%)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-700 mb-2">Ovulatory</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Peak energy (85%)</li>
                      <li>• Mild bloating (30%)</li>
                      <li>• Increased libido (70%)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-700 mb-2">Luteal</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Bloating (80%)</li>
                      <li>• Mood swings (65%)</li>
                      <li>• Breast tenderness (55%)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycle-health">
          <div className="grid gap-6">
            {/* Cycle Consistency */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Cycle Length Consistency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cycleConsistencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" domain={[25, 32]} />
                    <YAxis yAxisId="right" orientation="right" domain={[3, 4]} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="length" fill="#06b6d4" name="Cycle Length (days)" />
                    <Line yAxisId="right" type="monotone" dataKey="moodAvg" stroke="#a855f7" name="Avg Mood" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Phase Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Time Spent in Each Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={phaseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {phaseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cycle Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">8.2/10</div>
                      <p className="text-sm text-muted-foreground">Overall Health Score</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Regularity</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">8/10</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Symptom Management</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">7/10</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Mood Stability</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-full h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">9/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correlations">
          <div className="grid gap-6">
            {/* Correlation Heatmap */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Lifestyle Factor Correlations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  How different factors correlate with your mood, energy, and symptoms
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div></div>
                      <div className="text-center text-sm font-medium">Mood</div>
                      <div className="text-center text-sm font-medium">Energy</div>
                      <div className="text-center text-sm font-medium">Symptoms</div>
                    </div>
                    {correlationHeatmapData.map((row, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                        <div className="text-sm font-medium pr-2">{row.factor}</div>
                        <div className={`h-8 rounded flex items-center justify-center text-white text-xs font-medium ${getCorrelationColor(row.mood)} ${getCorrelationIntensity(row.mood)}`}>
                          {row.mood > 0 ? '+' : ''}{row.mood}
                        </div>
                        <div className={`h-8 rounded flex items-center justify-center text-white text-xs font-medium ${getCorrelationColor(row.energy)} ${getCorrelationIntensity(row.energy)}`}>
                          {row.energy > 0 ? '+' : ''}{row.energy}
                        </div>
                        <div className={`h-8 rounded flex items-center justify-center text-white text-xs font-medium ${getCorrelationColor(row.symptoms)} ${getCorrelationIntensity(row.symptoms)}`}>
                          {row.symptoms > 0 ? '+' : ''}{row.symptoms}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span>Strong Negative</span>
                    <span>Weak</span>
                    <span>Strong Positive</span>
                  </div>
                  <div className="flex mt-1">
                    <div className="flex-1 h-2 bg-red-500"></div>
                    <div className="flex-1 h-2 bg-orange-500"></div>
                    <div className="flex-1 h-2 bg-gray-300"></div>
                    <div className="flex-1 h-2 bg-yellow-500"></div>
                    <div className="flex-1 h-2 bg-green-500"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle>Key Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-green-700">💤 Sleep Quality</h4>
                    <p className="text-sm text-muted-foreground">Strong positive impact on mood and energy</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-blue-700">🏃‍♀️ Exercise</h4>
                    <p className="text-sm text-muted-foreground">Consistently improves mood and reduces symptoms</p>
                  </div>
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-red-700">😰 Stress</h4>
                    <p className="text-sm text-muted-foreground">Major factor in symptom severity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default PatternInsights;