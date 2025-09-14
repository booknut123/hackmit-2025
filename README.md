# Periodically. : Your cycle, Your story, Your insight.

Reimagining Bellabeat not as a wearable, but as a hyper-personalized AI wellness companion.
"If that company were founded today, what would it look like with AI in the driver’s seat?"

## What is Periodically. ?

Periodically is not a period tracker. It’s a **fundamental paradigm shift in personalized health AI** a platform where you converse with a wiser version of yourself, powered by your own data and patterns.

* You are the expert.
Our AI learns from your journal, voice, mood, and cycle, not from generic population averages.
* Hyper-personalized insights.
The app reflects your unique patterns, moods, and health correlations, empowering you to understand yourself.
* AI as your companion.
Not a chatbot, but a digital twin trained on your lived experience.

## Philosophy and Innovation
* Old Way (Bellabeat, Flo): Population-based, clinical, generic.
* Periodically. : Personal, empathetic, you-based.
The AI listens, learns, and reflects your own patterns back to you.

## Features

* Journal, Voice, Mood: Rich, subjective data input.
* Chat: Converse with your AI twin, powered by Claude API and your own history.
* Insights & Calendar: Discover correlations and trends unique to you.
* Pattern Analysis: ML and LLM fusion for pattern recognition and empathetic conversation.
* Privacy: Your data is yours, stored securely and used only for your personalized experience.

## Project Structure

src/
  components/
    homepage/           # Calendar, cycle info, journal details
    journal-entry/      # Mood, symptom, and notes logging
    chat/               # Chat interface with Claude API integration
    pattern-inights/    # Cycle pattern analytics and insights
    voice-recorder/     # Voice recording and transcription
    mood-visualization/ # Mood, energy, stress, sleep visualization
  context/
    UserContext.tsx     # Global user state with localStorage persistence
  services/
    claudeAPI.ts        # Claude API integration for personalized responses
  App.tsx               # Main app entry, context provider, routing
  index.css             # Global styles
.env                    # Environment variables (API keys)
README.md               # Project documentation

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Anthropic AI

# Dependencies 
* React (v18+)
* TypeScript
* Vite (for fast dev/build)
* lucide-react (icons)
* recharts (charts/visualizations)
* class-variance-authority (utility for UI variants)
* Tailwind CSS (utility-first styling)
* Claude API (Anthropic, for AI chat)
* (Optional) 
    * Express/Firebase/Supabase for backend user profiles

## Installation

1. Clone the repository
```bash
git clone https://github.com/booknut123/hackmit-2025
cd periodically
```
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
    * Create a .env file in the root and replace with your Claude API key: 
```bash
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

4. Start development server: 
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```
## Privacy and User Data 

* All personal data is stored locally or securely in your chosen backend.
* No data is shared or sold.
* User profiles are optional for MVP; all personalization is session-based unless you enable persistent profiles.

## Contributing

We welcome contributions!!!
Please open issues or pull requests for improvements, new features, or bug fixes.


## The Vision

Periodically is building the future of personalized health.
Today? Cycle health.
Tomorrow? Diet, exercise, stress through the lens of your unique biology.

### 🏆 Why Periodically Is Different
* Not a period tracker.
A personalized AI wellness companion.
* Not a chatbot.
A digital twin trained on your lived experience.
* Not just predictions.
Actionable, empathetic insights unique to you.

## License

MIT
