import React, { useEffect, useState } from "react";
import "./MoodVisualization.css";
import {
  Heart,
  Zap,
  Cloud,
  Moon,
  Smile,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types
interface DailyLog {
  log_date: string;
  day_rating: number;
  journal_entry: string;
  moods: string[];
  symptoms: string[];
  energy: number;
  sleep: number;
  stress: number;
  exercise: number;
  nutrition: number;
  social_connection: number;
}

export default function MoodVisualization() {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    // Fetch logs from backend
    fetch("http://localhost:8000/logs") // endpoint returns all daily logs
      .then((res) => res.json())
      .then((data) => {
        setDailyLogs(data);
        // pick today's log if exists
        const today = new Date().toISOString().split("T")[0];
        const todayEntry = data.find((log: DailyLog) => log.log_date === today);
        if (todayEntry) setTodayLog(todayEntry);
      })
      .catch(console.error);
  }, []);

  // Helper to scale 0-10 metrics to 0-100%
  const scaleToPercent = (val: number | undefined) =>
    val !== undefined && val !== null ? Math.round(val * 10) : 0;

  // Top cards
  const topCards = todayLog
    ? [
        {
          title: "Current Mood",
          value:
            todayLog.moods.length > 0 ? todayLog.moods.join(", ") : "Neutral",
          icon: <Heart className="moodviz-card-icon" />,
          color: "pink",
          pct: todayLog.day_rating ? scaleToPercent(todayLog.day_rating) : 0,
        },
        {
          title: "Energy Level",
          value: `${todayLog.energy || 0}%`,
          icon: <Zap className="moodviz-card-icon" />,
          color: "yellow",
          pct: scaleToPercent(todayLog.energy),
        },
        {
          title: "Stress Level",
          value: `${todayLog.stress || 0}%`,
          icon: <Cloud className="moodviz-card-icon" />,
          color: "blue",
          pct: scaleToPercent(todayLog.stress),
        },
        {
          title: "Sleep Quality",
          value: `${todayLog.sleep || 0}%`,
          icon: <Moon className="moodviz-card-icon" />,
          color: "purple",
          pct: scaleToPercent(todayLog.sleep),
        },
      ]
    : [];

  // Weekly trends
  const weeklyMoodData = dailyLogs.map((log) => ({
    day: new Date(log.log_date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    mood: log.day_rating || 0,
    energy: log.energy || 0,
    stress: log.stress || 0,
    sleep: log.sleep || 0,
  }));

  // Radar / cycle phase mockup (could calculate based on periods table)
  const radarData = [
    { phase: "Menstrual", mood: 2, energy: 2, stress: 3, sleep: 4 },
    { phase: "Follicular", mood: 4, energy: 5, stress: 2, sleep: 4 },
    { phase: "Ovulatory", mood: 5, energy: 5, stress: 1, sleep: 4 },
    { phase: "Luteal", mood: 3, energy: 3, stress: 3, sleep: 3 },
  ];

  return (
    <div className="moodviz-container">
      {/* Top Cards */}
      <div className="moodviz-top-cards">
        {topCards.map((card) => (
          <div key={card.title} className={`moodviz-card ${card.color}`}>
            <div className="moodviz-card-title">{card.title}</div>
            <div className="moodviz-card-value">
              {card.icon} {card.value}
            </div>
            <div className="moodviz-card-bar">
              <div
                className={`moodviz-card-bar-fill ${card.color}`}
                style={{ width: `${card.pct}%` }}
              ></div>
            </div>
            <div className="moodviz-card-desc">
              {card.title} {card.pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Mood Trends */}
      <div className="moodviz-section">
        <div className="moodviz-section-title">
          <BarChart3 className="moodviz-section-icon" /> Weekly Mood Trends
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyMoodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#f472b6"
              strokeWidth={2}
              name="Mood"
              dot
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#fbbf24"
              strokeWidth={2}
              name="Energy"
              dot
            />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#60a5fa"
              strokeWidth={2}
              name="Stress"
              dot
            />
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#a78bfa"
              strokeWidth={2}
              name="Sleep"
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart for Cycle Phases */}
      <div className="moodviz-section">
        <div className="moodviz-section-title">Mood by Cycle Phase</div>
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="phase" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar
              name="Mood"
              dataKey="mood"
              stroke="#f472b6"
              fill="#f472b6"
              fillOpacity={0.3}
            />
            <Radar
              name="Energy"
              dataKey="energy"
              stroke="#fbbf24"
              fill="#fde68a"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}