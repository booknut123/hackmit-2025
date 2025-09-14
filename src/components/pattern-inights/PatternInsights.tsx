import React, { useState, useMemo } from "react";
import "./PatternInsights.css";
import {
  TrendingUp,
  Activity,
  Calendar,
  PieChart,
  Heart,
  Zap,
  Cloud,
  Target,
  Clock,
} from "lucide-react";

interface JournalEntry {
  log_date: string;
  day_rating?: number;
  journal_entry?: string;
  moods: string[];
  symptoms: string[];
  energy?: number;
  sleep?: number;
  stress?: number;
  exercise?: number;
  nutrition?: number;
  social_connection?: number;
}

interface MoodVisualizationProps {
  journalEntries: JournalEntry[];
}

const MoodVisualization = ({ journalEntries }: MoodVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("mood-trends");

  // --- Transform real journalEntries into chart-friendly data ---

  // Mood trends (day_rating + energy over time)
  const moodTrendsData = useMemo(() => {
    return journalEntries.map((entry, index) => ({
      day: index + 1,
      mood: entry.day_rating || 0,
      energy: entry.energy || 0,
    }));
  }, [journalEntries]);

  // Symptom frequency
  const symptomsData = useMemo(() => {
    const counts: Record<string, number> = {};
    journalEntries.forEach((entry) => {
      entry.symptoms.forEach((symptom) => {
        if (!counts[symptom]) counts[symptom] = 0;
        counts[symptom] += 1;
      });
    });
    return Object.entries(counts).map(([symptom, frequency]) => ({
      symptom,
      frequency,
    }));
  }, [journalEntries]);

  // Correlations (very basic demo until proper stats are done)
  const correlationData = useMemo(() => {
    if (journalEntries.length === 0) return [];
    const avg = (key: keyof JournalEntry) =>
      journalEntries.reduce((sum, e) => {
        const value = e[key];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0) / journalEntries.length;

    return [
      {
        factor: "Sleep Quality",
        mood: avg("day_rating") - 3,
        energy: avg("energy") - 3,
        symptoms: -(symptomsData.length / 2),
      },
      {
        factor: "Exercise",
        mood: avg("exercise") - 2,
        energy: avg("exercise"),
        symptoms: -avg("exercise"),
      },
      {
        factor: "Stress",
        mood: -avg("stress"),
        energy: -avg("stress"),
        symptoms: avg("stress"),
      },
    ];
  }, [journalEntries, symptomsData]);

  // Cycle health (basic scoring from averages + symptom burden)
  const cycleHealthData = useMemo(() => {
    if (journalEntries.length === 0) return [];
    const avg = (key: keyof JournalEntry) =>
      journalEntries.reduce((sum, e) => {
        const value = e[key];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0) / journalEntries.length;

    return [
      { metric: "Regularity", score: 8, max: 10 }, // static until cycle tracking
      {
        metric: "Symptom Management",
        score: 10 - Math.min(symptomsData.length, 10),
        max: 10,
      },
      { metric: "Mood Stability", score: avg("day_rating") || 0, max: 5 },
      {
        metric: "Overall Health Score",
        score:
          ((avg("day_rating") || 0) +
            (avg("energy") || 0) +
            (avg("sleep") || 0)) /
          1.5,
        max: 10,
      },
    ];
  }, [journalEntries, symptomsData]);

  // Helpers
  const formatCorrelationValue = (value: number) =>
    value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);

  const getCorrelationColor = (value: number) => {
    if (value >= 3) return "#22c55e";
    if (value >= 1) return "#86efac";
    if (value <= -3) return "#ef4444";
    if (value <= -1) return "#fca5a5";
    return "#6b7280";
  };

  return (
    <div className="moodviz-container">
      {/* Tabs */}
      <div className="pattern-tabs">
        <button
          className={`pattern-tab-btn ${
            activeTab === "mood-trends" ? "active" : ""
          }`}
          onClick={() => setActiveTab("mood-trends")}
        >
          <TrendingUp className="pattern-tab-icon" />
          Mood Trends
        </button>
        <button
          className={`pattern-tab-btn ${
            activeTab === "symptoms" ? "active" : ""
          }`}
          onClick={() => setActiveTab("symptoms")}
        >
          <Activity className="pattern-tab-icon" />
          Symptoms
        </button>
        <button
          className={`pattern-tab-btn ${
            activeTab === "cycle-health" ? "active" : ""
          }`}
          onClick={() => setActiveTab("cycle-health")}
        >
          <Calendar className="pattern-tab-icon" />
          Cycle Health
        </button>
        <button
          className={`pattern-tab-btn ${
            activeTab === "correlations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("correlations")}
        >
          <PieChart className="pattern-tab-icon" />
          Correlations
        </button>
      </div>

      {/* Mood Trends */}
      {activeTab === "mood-trends" && (
        <div className="pattern-section">
          <div className="pattern-card">
            <div className="pattern-card-title">
              Mood & Energy Throughout Cycle
            </div>
            <div className="pattern-chart">
              <div className="mock-chart">
                <div className="chart-y-axis">
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                </div>
                <div className="chart-bars">
                  {moodTrendsData.map((data, index) => (
                    <div key={index} className="chart-bar-group">
                      <div
                        className="chart-bar mood-bar"
                        style={{ height: `${data.mood * 20}%` }}
                      />
                      <div
                        className="chart-bar energy-bar"
                        style={{ height: `${data.energy * 20}%` }}
                      />
                      <span className="chart-day">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Symptoms */}
      {activeTab === "symptoms" && (
        <div className="pattern-section">
          <div className="symptoms-grid">
            <div className="symptoms-card">
              <h3 className="symptoms-title">Most Common Symptoms</h3>
              <div className="symptoms-list">
                {symptomsData.map((symptom, index) => (
                  <div key={index} className="symptom-item">
                    <span className="symptom-name">{symptom.symptom}</span>
                    <div className="symptom-frequency">
                      <div
                        className="frequency-bar"
                        style={{
                          width: `${
                            (symptom.frequency / journalEntries.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="symptom-count">{symptom.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correlations */}
      {activeTab === "correlations" && (
        <div className="pattern-section">
          <div className="correlations-grid">
            <div className="correlations-card">
              <h3 className="correlations-title">
                Lifestyle Factor Correlations
              </h3>
              <div className="correlations-table">
                <div className="table-header">
                  <span>Factor</span>
                  <span>Mood</span>
                  <span>Energy</span>
                  <span>Symptoms</span>
                </div>
                {correlationData.map((item, index) => (
                  <div key={index} className="table-row">
                    <span className="factor-name">{item.factor}</span>
                    <span
                      className="correlation-value"
                      style={{ color: getCorrelationColor(item.mood) }}
                    >
                      {formatCorrelationValue(item.mood)}
                    </span>
                    <span
                      className="correlation-value"
                      style={{ color: getCorrelationColor(item.energy) }}
                    >
                      {formatCorrelationValue(item.energy)}
                    </span>
                    <span
                      className="correlation-value"
                      style={{ color: getCorrelationColor(item.symptoms) }}
                    >
                      {formatCorrelationValue(item.symptoms)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="key-correlations-card">
              <h3 className="correlations-title">Key Correlations</h3>
              <div className="key-correlations-list">
                <div className="key-correlation-item">
                  <div className="correlation-header">
                    <Heart className="correlation-icon" />
                    <span className="correlation-factor">Sleep Quality</span>
                    <span className="correlation-impact positive">
                      Positive
                    </span>
                  </div>
                  <p className="correlation-desc">
                    Better sleep → better mood and energy
                  </p>
                </div>
                <div className="key-correlation-item">
                  <div className="correlation-header">
                    <Zap className="correlation-icon" />
                    <span className="correlation-factor">Exercise</span>
                    <span className="correlation-impact positive">
                      Positive
                    </span>
                  </div>
                  <p className="correlation-desc">
                    Activity reduces symptoms and improves energy
                  </p>
                </div>
                <div className="key-correlation-item">
                  <div className="correlation-header">
                    <Cloud className="correlation-icon" />
                    <span className="correlation-factor">Stress</span>
                    <span className="correlation-impact negative">
                      Negative
                    </span>
                  </div>
                  <p className="correlation-desc">
                    Higher stress → worse symptoms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cycle Health */}
      {activeTab === "cycle-health" && (
        <div className="pattern-section">
          <div className="cycle-health-grid">
            <div className="health-scores-card">
              <h3 className="health-title">Cycle Health Score</h3>
              <div className="health-scores">
                {cycleHealthData.map((health, index) => (
                  <div key={index} className="health-score-item">
                    <div className="health-score-header">
                      <span className="health-metric">{health.metric}</span>
                      <span className="health-value">
                        {health.score.toFixed(1)}/{health.max}
                      </span>
                    </div>
                    <div className="health-progress-bar">
                      <div
                        className="health-progress-fill"
                        style={{
                          width: `${(health.score / health.max) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cycle-stats-card">
              <h3 className="health-title">Cycle Statistics</h3>
              <div className="cycle-stats">
                <div className="stat-item">
                  <Target className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">28-32</span>
                    <span className="stat-label">Cycle Length Range</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Clock className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">5-7</span>
                    <span className="stat-label">Period Duration</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Activity className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">85%</span>
                    <span className="stat-label">Regularity Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodVisualization;
