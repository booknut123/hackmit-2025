import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Bot, User, Calendar, Heart, TrendingUp } from 'lucide-react';

type Cycle = {
  startDate: Date;
  currentDay: number;
  phase: string;
};

type JournalEntry = {
  id?: number;
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  voice_note?: string | null;
};

type ChatInterfaceProps = {
  journalEntries: JournalEntry[];
  currentCycle: Cycle;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ journalEntries, currentCycle }) => {
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

    // Simulate AI thinking time
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
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    { icon: Heart, text: "How am I feeling compared to last month?", color: "text-pink-500" },
    { icon: Calendar, text: "When is my next period due?", color: "text-purple-500" },
    { icon: TrendingUp, text: "Show me my mood patterns", color: "text-blue-500" }
  ];

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3>Luna AI</h3>
                <p className="text-sm text-muted-foreground font-normal">Your intelligent cycle companion</p>
              </div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-1 text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Online</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Quick Questions</h4>
            <div className="grid gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setNewMessage(action.text)}
                    className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors text-left"
                  >
                    <Icon className={`h-4 w-4 ${action.color}`} />
                    <span className="text-sm">{action.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={
                      message.type === 'ai' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                        : 'bg-gray-200'
                    }>
                      {message.type === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 max-w-[70%] ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.type === 'ai'
                          ? 'bg-white border border-purple-100'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'ai' ? 'text-muted-foreground' : 'text-purple-100'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 bg-white border border-purple-100 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Ask me about your cycle, patterns, or how you're feeling..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white/50 border-purple-200 focus:border-purple-400"
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Context Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="text-sm space-y-1">
            <p><strong>Current Context:</strong> Day {currentCycle.currentDay} • {currentCycle.phase} phase</p>
            <p><strong>Recent Entries:</strong> {journalEntries.length} journal entries available for analysis</p>
            <p className="text-muted-foreground text-xs">Luna can reference your specific journal entries and cycle data to provide personalized insights.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;