import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';
import { Send, Bot, User, Calendar, Heart, TrendingUp } from 'lucide-react';

const ChatInterface = ({ journalEntries, currentCycle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm Luna, your personal cycle companion. I've been analyzing your journal entries and I'm here to help you understand your patterns better. How are you feeling today?",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  const aiResponses = {
    mood: [
      "I noticed from your December 12th entry that you experienced some bloating. This is very common during the luteal phase! Would you like some tips for managing this?",
      "Looking at your patterns, you tend to feel more energetic during your follicular phase. This is totally normal due to rising estrogen levels!",
      "Based on your journal entries, you seem to handle stress really well during your cycle. That's amazing!"
    ],
    symptoms: [
      "I see you've been tracking cramps. From your entry on December 12th, you mentioned they were mild and manageable. Have you tried any specific remedies that help?",
      "Your energy levels seem to correlate with your cycle phase. This is completely normal - many people experience this pattern!",
      "I noticed you mentioned clear skin in one of your positive entries. Your skin health often reflects hormonal changes throughout your cycle."
    ],
    patterns: [
      "Looking at your data, you tend to feel happiest around day 10-14 of your cycle. This aligns with ovulation when estrogen peaks!",
      "I've noticed that your mood tends to improve when you mention self-care activities like tea or walks. Keep up those healthy habits!",
      "Your journal shows great self-awareness. Tracking these patterns helps predict and prepare for different phases."
    ],
    general: [
      "Remember, every cycle is unique and your experience is valid. Keep tracking - the insights become more valuable over time!",
      "You're doing great at listening to your body. Is there anything specific about your current cycle phase you'd like to understand better?",
      "Your current follicular phase is a great time for new projects and social activities. How are you feeling about taking on new challenges right now?"
    ]
  };

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('mood') || lowerMessage.includes('feel')) {
      return aiResponses.mood[Math.floor(Math.random() * aiResponses.mood.length)];
    }
    if (lowerMessage.includes('cramp') || lowerMessage.includes('symptom') || lowerMessage.includes('pain')) {
      return aiResponses.symptoms[Math.floor(Math.random() * aiResponses.symptoms.length)];
    }
    if (lowerMessage.includes('pattern') || lowerMessage.includes('cycle') || lowerMessage.includes('phase')) {
      return aiResponses.patterns[Math.floor(Math.random() * aiResponses.patterns.length)];
    }
    return aiResponses.general[Math.floor(Math.random() * aiResponses.general.length)];
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(newMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
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

  const formatTime = (timestamp) => {
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
        {messages.map((message) => (
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
          onChange={(e) => setNewMessage(e.target.value)}
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