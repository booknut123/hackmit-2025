import React, { useState } from 'react';
import './PatternInsights.css';
import { BarChart3, TrendingUp, Activity, Calendar, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatternInsights = ({ journalEntries }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [activeTab, setActiveTab] = useState('mood-trends');

  // Mock data for chart
  const moodTrendsData = [
    { day: 1, mood: 3, energy: 2 },
    { day: 3, mood: 2, energy: 2 },
    { day: 5, mood: 3, energy: 3 },
    { day: 8, mood: 4, energy: 4 },
    { day: 10, mood: 5, energy: 5 },
    { day: 12, mood: 4, energy: 4 },
    { day: 14, mood: 5, energy: 5 },
    { day: 16, mood: 4, energy: 4 },
    { day: 18, mood: 3, energy: 3 },
    { day: 21, mood: 2, energy: 2 },
    { day: 24, mood: 2, energy: 2 },
    { day: 26, mood: 3, energy: 3 },
    { day: 28, mood: 2, energy: 2 }
  ];

  return (
    <div className="pattern-container">
      {/* Header */}
      <div className="pattern-header">
        <div className="pattern-header-left">
          <BarChart3 className="pattern-header-icon" />
          <span className="pattern-header-title">Pattern Insights</span>
        </div>
        <div className="pattern-header-right">
          {['1M', '3M', '6M'].map(period => (
            <button
              key={period}
              className={`pattern-timeframe-btn${selectedTimeframe === period.toLowerCase() ? ' active' : ''}`}
              onClick={() => setSelectedTimeframe(period.toLowerCase())}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="pattern-tabs">
        <button
          className={`pattern-tab-btn${activeTab === 'mood-trends' ? ' active' : ''}`}
          onClick={() => setActiveTab('mood-trends')}
        >
          <TrendingUp className="pattern-tab-icon" />
          Mood Trends
        </button>
        <button
          className={`pattern-tab-btn${activeTab === 'symptoms' ? ' active' : ''}`}
          onClick={() => setActiveTab('symptoms')}
        >
          <Activity className="pattern-tab-icon" />
          Symptoms
        </button>
        <button
          className={`pattern-tab-btn${activeTab === 'cycle-health' ? ' active' : ''}`}
          onClick={() => setActiveTab('cycle-health')}
        >
          <Calendar className="pattern-tab-icon" />
          Cycle Health
        </button>
        <button
          className={`pattern-tab-btn${activeTab === 'correlations' ? ' active' : ''}`}
          onClick={() => setActiveTab('correlations')}
        >
          <PieIcon className="pattern-tab-icon" />
          Correlations
        </button>
      </div>

      {/* Mood Trends Tab */}
      {activeTab === 'mood-trends' && (
        <div className="pattern-section">
          <div className="pattern-card">
            <div className="pattern-card-title">Mood & Energy Throughout Cycle</div>
            <div className="pattern-chart">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={moodTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.3}
                    name="Mood"
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.3}
                    name="Energy"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pattern-insights-row">
            <div className="pattern-insight-card green">
              <div className="pattern-insight-title">Peak Energy</div>
              <div className="pattern-insight-phase">Days 8-14 (Follicular/Ovulatory)</div>
              <div className="pattern-insight-desc">Best time for important tasks</div>
            </div>
            <div className="pattern-insight-card yellow">
              <div className="pattern-insight-title">Mood Dips</div>
              <div className="pattern-insight-phase">Days 21-26 (Late Luteal)</div>
              <div className="pattern-insight-desc">Plan extra self-care</div>
            </div>
            <div className="pattern-insight-card purple">
              <div className="pattern-insight-title">Recovery</div>
              <div className="pattern-insight-phase">Days 5-7 (Late Menstrual)</div>
              <div className="pattern-insight-desc">Mood starts improving</div>
            </div>
          </div>
        </div>
      )}
      {/* Other tabs can be implemented similarly */}
    </div>
  );
};

export default PatternInsights;