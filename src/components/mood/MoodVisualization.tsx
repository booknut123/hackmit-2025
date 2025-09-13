import React from 'react';
import './MoodVisualization.css';
import { Heart, Zap, Cloud, Moon, Smile, BarChart3, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MoodVisualization() {
  // Mock data
  const moodJourneyData = [
    { time: '6:00', mood: 2, energy: 3, stress: 1, sleep: 4 },
    { time: '9:00', mood: 3, energy: 4, stress: 2, sleep: 4 },
    { time: '12:00', mood: 4, energy: 5, stress: 2, sleep: 4 },
    { time: '15:00', mood: 5, energy: 4, stress: 3, sleep: 3 },
    { time: '18:00', mood: 4, energy: 3, stress: 2, sleep: 3 },
    { time: '21:00', mood: 3, energy: 2, stress: 1, sleep: 4 },
  ];

  const spectrumData = [
    { label: 'Joy', value: 4.2 },
    { label: 'Anxiety', value: 2.1 },
    { label: 'Sadness', value: 1.8 },
    { label: 'Energy', value: 4.6 },
    { label: 'Calm', value: 3.8 },
  ];

  const radarData = [
    { phase: 'Menstrual', mood: 2, energy: 2, stress: 3, sleep: 4 },
    { phase: 'Follicular', mood: 4, energy: 5, stress: 2, sleep: 4 },
    { phase: 'Ovulatory', mood: 5, energy: 5, stress: 1, sleep: 4 },
    { phase: 'Luteal', mood: 3, energy: 3, stress: 3, sleep: 3 },
  ];

  const weeklyMoodData = [
    { day: 'Mon', mood: 4, energy: 4 },
    { day: 'Tue', mood: 5, energy: 5 },
    { day: 'Wed', mood: 4, energy: 4 },
    { day: 'Thu', mood: 3, energy: 3 },
    { day: 'Fri', mood: 5, energy: 4 },
    { day: 'Sat', mood: 3, energy: 3 },
    { day: 'Sun', mood: 4, energy: 4 },
  ];

  const factors = [
    { label: 'Sleep Quality', value: 85, goal: 90, status: 'Needs attention' },
    { label: 'Exercise', value: 70, goal: 80, status: 'Optimal' },
    { label: 'Stress Level', value: 30, goal: 20, status: 'Optimal' },
    { label: 'Social Connection', value: 75, goal: 85, status: 'Needs attention' },
    { label: 'Nutrition', value: 80, goal: 85, status: 'Needs attention' },
  ];

  const insights = [
    { label: 'Current Streak', desc: "7 days of positive mood! You're in your follicular phase sweet spot.", icon: <CheckCircle className="insight-icon green" /> },
    { label: 'Strength Pattern', desc: "Your energy peaks around day 10-14. Perfect timing for big projects!", icon: <TrendingUp className="insight-icon yellow" /> },
    { label: 'Upcoming Changes', desc: "Expect energy to dip around day 21. Plan relaxing activities then.", icon: <AlertCircle className="insight-icon purple" /> },
  ];

  return (
    <div className="moodviz-container">
      {/* Top Cards */}
      <div className="moodviz-top-cards">
        <div className="moodviz-card pink">
          <div className="moodviz-card-title">Current Mood</div>
          <div className="moodviz-card-value"><Heart className="moodviz-card-icon" /> Happy</div>
          <div className="moodviz-card-bar">
            <div className="moodviz-card-bar-fill pink" style={{ width: '88%' }}></div>
          </div>
          <div className="moodviz-card-desc">Happiness: 88%</div>
        </div>
        <div className="moodviz-card yellow">
          <div className="moodviz-card-title">Energy Level</div>
          <div className="moodviz-card-value"><Zap className="moodviz-card-icon" /> 70%</div>
          <div className="moodviz-card-bar">
            <div className="moodviz-card-bar-fill yellow" style={{ width: '70%' }}></div>
          </div>
          <div className="moodviz-card-desc">Above average for cycle day</div>
        </div>
        <div className="moodviz-card blue">
          <div className="moodviz-card-title">Stress Level</div>
          <div className="moodviz-card-value"><Cloud className="moodviz-card-icon" /> 30%</div>
          <div className="moodviz-card-bar">
            <div className="moodviz-card-bar-fill blue" style={{ width: '30%' }}></div>
          </div>
          <div className="moodviz-card-desc">Low stress day!</div>
        </div>
        <div className="moodviz-card purple">
          <div className="moodviz-card-title">Sleep Quality</div>
          <div className="moodviz-card-value"><Moon className="moodviz-card-icon" /> 88%</div>
          <div className="moodviz-card-bar">
            <div className="moodviz-card-bar-fill purple" style={{ width: '88%' }}></div>
          </div>
          <div className="moodviz-card-desc">Excellent sleep (tracked)</div>
        </div>
      </div>

      {/* Mood Journey Chart */}
      <div className="moodviz-section">
        <div className="moodviz-section-title"><BarChart3 className="moodviz-section-icon" /> Today's Mood Journey</div>
        <div className="moodviz-chart">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodJourneyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Area type="monotone" dataKey="energy" stroke="#fbbf24" fill="#fde68a" fillOpacity={0.4} name="Energy" />
              <Line type="monotone" dataKey="mood" stroke="#f472b6" strokeWidth={2} name="Mood" dot />
              <Line type="monotone" dataKey="stress" stroke="#60a5fa" strokeWidth={2} name="Stress" dot />
              <Line type="monotone" dataKey="sleep" stroke="#a78bfa" strokeWidth={2} name="Sleep" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emotional Spectrum Analysis */}
      <div className="moodviz-spectrum-row">
        {spectrumData.map((item, idx) => (
          <div key={item.label} className={`moodviz-spectrum-card ${item.label.toLowerCase()}`}>
            <div className="moodviz-spectrum-icon">
              {item.label === 'Joy' && <Smile />}
              {item.label === 'Anxiety' && <AlertCircle />}
              {item.label === 'Sadness' && <Cloud />}
              {item.label === 'Energy' && <Zap />}
              {item.label === 'Calm' && <Moon />}
            </div>
            <div className="moodviz-spectrum-label">{item.label}</div>
            <div className="moodviz-spectrum-value">{item.value}</div>
            <div className={`moodviz-spectrum-bar ${item.label.toLowerCase()}`}>
              <div className={`moodviz-spectrum-bar-fill ${item.label.toLowerCase()}`} style={{ width: `${item.value * 20}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mood by Cycle Phase & Weekly Mood Trends */}
      <div className="moodviz-row">
        <div className="moodviz-half-card">
          <div className="moodviz-section-title">Mood by Cycle Phase</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="phase" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar name="Mood" dataKey="mood" stroke="#f472b6" fill="#f472b6" fillOpacity={0.3} />
              <Radar name="Energy" dataKey="energy" stroke="#fbbf24" fill="#fde68a" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="moodviz-half-card">
          <div className="moodviz-section-title">Weekly Mood Trends</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyMoodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#f472b6" strokeWidth={2} name="Mood" dot />
              <Line type="monotone" dataKey="energy" stroke="#fbbf24" strokeWidth={2} name="Energy" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Factors Influencing Mood */}
      <div className="moodviz-factors-card">
        <div className="moodviz-section-title">Factors Influencing Your Mood</div>
        {factors.map((factor, idx) => (
          <div key={factor.label} className="moodviz-factor-row">
            <span className="moodviz-factor-label">{factor.label}</span>
            <div className="moodviz-factor-bar">
              <div className="moodviz-factor-bar-fill" style={{ width: `${factor.value}%` }}></div>
            </div>
            <span className="moodviz-factor-value">{factor.value}% / {factor.goal}%</span>
            <span className={`moodviz-factor-status ${factor.status === 'Optimal' ? 'optimal' : 'attention'}`}>{factor.status}</span>
          </div>
        ))}
      </div>

      {/* Personalized Insights */}
      <div className="moodviz-insights-row">
        {insights.map((insight, idx) => (
          <div key={insight.label} className="moodviz-insight-card">
            <div className="moodviz-insight-icon">{insight.icon}</div>
            <div className="moodviz-insight-label">{insight.label}</div>
            <div className="moodviz-insight-desc">{insight.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}