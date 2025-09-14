import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';
import { Send, Bot, User, Calendar, Heart, TrendingUp } from 'lucide-react';

// Define the JournalEntry type
interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'happy' | 'energetic' | 'neutral' | 'sad';
  symptoms: string[];
  notes?: string;
  voice_note?: string;
}

// Define the Cycle type
interface Cycle {
  currentDay: number;
  phase: string;
}

// Props for the component
interface ChatInterfaceProps {
  journalEntries: JournalEntry[];
  currentCycle: Cycle;
}

// Placeholder AI response function
async function generatePersonalizedResponse(
  userMessage: string,
  journalEntries: JournalEntry[],
  currentCycleDay: number
): Promise<string> {
  // Reference all parameters to avoid TS warnings
  return `You said: "${userMessage}". You have ${journalEntries.length} journal entries, and today is day ${currentCycleDay} of your cycle.`;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ journalEntries, currentCycle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai' as 'ai' | 'user',
      content:
        "Hi! I'm Luna, your personal cycle companion. I've been analyzing your journal entries and I'm here to help you understand your patterns better. How are you feeling today?",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: 'user' as 'ai' | 'user',
      content: newMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const aiContent = await generatePersonalizedResponse(
        userMessage.content,
        journalEntries,
        currentCycle.currentDay
      );
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai' as 'ai' | 'user',
        content: aiContent,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, aiResponse]);
    } catch {
        setMessages(prev => [
        ...prev,
        {
            id: Date.now() + 2,
            type: 'ai',
            content: "Sorry, I couldn't process your request. Please try again.",
            timestamp: new Date()
        }
        ]);
    }
    
    setIsTyping(false);
};

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { icon: <Heart className="quick-icon pink" />, text: "How am I feeling compared to last month?" },
    { icon: <Calendar className="quick-icon purple" />, text: "When is my next period due?" },
    { icon: <TrendingUp className="quick-icon blue" />, text: "Show me my mood patterns" }
  ];

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">
            <Bot className="chat-avatar-icon" />
          </div>
          <div>
            <div className="chat-title">Luna AI</div>
            <div className="chat-subtitle">Your intelligent cycle companion</div>
          </div>
        </div>
        <div className="chat-header-right">
          <span className="chat-online-dot"></span>
          <span className="chat-online-text">Online</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="chat-quick-actions">
        <div className="chat-quick-title">Quick Questions</div>
        <div className="chat-quick-list">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="chat-quick-btn"
              onClick={() => setNewMessage(action.text)}
              type="button"
            >
              {action.icon}
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages" ref={scrollAreaRef}>
        {messages.map(message => (
          <div key={message.id} className={`chat-message-row ${message.type === 'user' ? 'user' : 'ai'}`}>
            <div className="chat-message-avatar">
              {message.type === 'ai' ? (
                <div className="chat-avatar ai"><Bot className="chat-avatar-icon" /></div>
              ) : (
                <div className="chat-avatar user"><User className="chat-avatar-icon" /></div>
              )}
            </div>
            <div className="chat-message-bubble">
              <div className="chat-message-content">{message.content}</div>
              <div className="chat-message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message-row ai">
            <div className="chat-message-avatar">
              <div className="chat-avatar ai"><Bot className="chat-avatar-icon" /></div>
            </div>
            <div className="chat-message-bubble">
              <div className="chat-message-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask me about your cycle, patterns, or how you're feeling..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!newMessage.trim() || isTyping}
          type="button"
        >
          <Send className="chat-send-icon" />
        </button>
      </div>

      {/* Context Info */}
      <div className="chat-context">
        <div><strong>Current Context:</strong> Day {currentCycle.currentDay} • {currentCycle.phase} phase</div>
        <div><strong>Recent Entries:</strong> {journalEntries.length} journal entries available for analysis</div>
        <div className="chat-context-note">Luna can reference your specific journal entries and cycle data to provide personalized insights.</div>
      </div>
    </div>
  );
};

export default ChatInterface;
