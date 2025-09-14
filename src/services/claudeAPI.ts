const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

export type JournalEntry = {
  id?: string | number;
  date: string;
  mood: string | string[];
  symptoms: string[];
  notes?: string;
  voice_note?: string | null;
  cycleDay?: number;
  content?: string;
};

export const getCyclePhase = (day: number): string => {
  if (day >= 1 && day <= 5) return 'Menstrual';
  if (day >= 6 && day <= 13) return 'Follicular';
  if (day >= 14 && day <= 16) return 'Ovulatory';
  if (day >= 17 && day <= 28) return 'Luteal';
  return 'Unknown';
};

// Create a context-aware prompt for Claude
const createContextualPrompt = (
  userMessage: string,
  journalEntries: JournalEntry[],
  currentCycleDay: number
): string => {
  const phase = getCyclePhase(currentCycleDay);
  
  // Format recent journal entries for context
  const recentEntries = journalEntries.slice(-5).map(entry => {
    const mood = Array.isArray(entry.mood) ? entry.mood.join(', ') : entry.mood;
    return `Date: ${entry.date}, Cycle Day: ${entry.cycleDay || 'unknown'}, Mood: ${mood}, Symptoms: ${entry.symptoms.join(', ') || 'none'}, Notes: ${entry.content || entry.notes || 'No notes'}`;
  }).join('\n');

  return `You are Luna, a compassionate AI assistant specializing in menstrual cycle tracking and women's health. You have access to the user's journal entries and cycle data.

Current Context:
- User is on day ${currentCycleDay} of their cycle
- Current phase: ${phase}
- Recent journal entries (most recent first):
${recentEntries}

User's message: "${userMessage}"

Please respond in a warm, supportive tone while referencing their specific data when relevant. Provide insights about their cycle patterns, validate their experiences, and offer helpful suggestions. Keep responses conversational and personal, not clinical.`;
};

// Fallback responses for when API fails
const generateFallbackResponse = (
  userMessage: string,
  recentEntries: any[],
  currentCycleDay: number
): string => {
  const phase = getCyclePhase(currentCycleDay);
  const lowerMessage = userMessage.toLowerCase();
  const mostRecentEntry = recentEntries[0];

  if (lowerMessage.includes('feel') || lowerMessage.includes('mood')) {
    if (mostRecentEntry) {
      return `I can see from your recent entry on ${mostRecentEntry.date} that you mentioned feeling ${mostRecentEntry.mood}${mostRecentEntry.symptoms.length > 0 ? ` and experiencing ${mostRecentEntry.symptoms.join(', ')}` : ''}. On day ${currentCycleDay} of your ${phase.toLowerCase()} phase, these feelings are completely normal. ${phase === 'Follicular' ? 'This is typically when energy starts building!' : phase === 'Luteal' ? 'Your body is preparing for your next cycle.' : 'Every phase brings its own experiences.'}`;
    }
  }

  if (lowerMessage.includes('pattern') || lowerMessage.includes('trend')) {
    const recentMoods = recentEntries.map(e => e.mood).filter(Boolean);
    if (recentMoods.length > 0) {
      return `Looking at your recent entries, I notice you've been tracking moods like ${recentMoods.slice(0, 3).join(', ')}. This aligns with your current ${phase.toLowerCase()} phase (day ${currentCycleDay}). Keep tracking - I'm getting better at understanding your unique patterns!`;
    }
  }

  if (lowerMessage.includes('next') && lowerMessage.includes('period')) {
    const daysUntilNext = 28 - currentCycleDay;
    return `Based on your current cycle day (${currentCycleDay}), your next period is likely in about ${daysUntilNext} days. I'll get more accurate as we track more cycles together!`;
  }

  return `You're on day ${currentCycleDay} of your ${phase.toLowerCase()} phase. I'm here to help you understand your patterns and support your wellness journey. What would you like to explore about your cycle today?`;
};

export const generatePersonalizedResponse = async (
  userMessage: string,
  journalHistory: JournalEntry[],
  currentCycleDay: number
): Promise<string> => {
  // Prepare recent entries for fallback
  const recentEntries = journalHistory.slice(-5).map(entry => ({
    date: entry.date,
    mood: Array.isArray(entry.mood) ? entry.mood.join(', ') : entry.mood,
    symptoms: entry.symptoms || [],
    cycleDay: entry.cycleDay,
    content: entry.content || entry.notes || 'No content'
  }));

  // If no API key, use fallback immediately
  if (!API_KEY) {
    console.warn('No Claude API key found, using fallback responses');
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    return generateFallbackResponse(userMessage, recentEntries, currentCycleDay);
  }

  try {
    const prompt = createContextualPrompt(userMessage, journalHistory, currentCycleDay);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;

  } catch (error) {
    console.error('Claude API Error:', error);
    
    // Use fallback response that references actual user data
    return generateFallbackResponse(userMessage, recentEntries, currentCycleDay);
  }
};