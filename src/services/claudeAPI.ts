const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.REACT_APP_CLAUDE_API_KEY; // found in our .env file

export const generatePersonalizedResponse = async (userMessage, journalHistory, currentCycleDay) => {
  const contextPrompt = `You are responding as the user's wise, supportive inner voice. 
  Based on their journal history: ${JSON.stringify(journalHistory.slice(-5))} 
  Current cycle day: ${currentCycleDay}
  User message: "${userMessage}"
  
  Respond as if you're their own intuition, referencing their past patterns and insights.`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 300,
        messages: [{ role: 'user', content: contextPrompt }]
      })
    });
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    return "I'm here for you. Sometimes I need a moment to process - try again?";
  }
};