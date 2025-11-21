
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User, Bot, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { chatWithCoach } from '../services/geminiService';

interface ChatViewProps {
  onBack: () => void;
  profile: UserProfile;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBack, profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: `Hey ${profile.name}! I'm your JellyCoach. How is your ${profile.sport} training going?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Convert chat history format for Gemini SDK
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithCoach(profile, userMsg.text, history);
    
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-slate-200 px-4 py-4 flex items-center shadow-sm">
        <button onClick={onBack} className="mr-4 text-slate-500 hover:text-navy-900 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="font-serif font-bold text-xl text-navy-900">Coach Chat</h1>
           <p className="text-xs text-green-600 font-medium flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-navy-900 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase tracking-wider font-bold">
                {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                {msg.role === 'user' ? 'You' : 'Coach'}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-navy-600" />
                <span className="text-xs text-slate-400 font-medium">Thinking...</span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 pb-8">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about technique, recovery, strategy..."
            className="w-full bg-slate-100 border-0 rounded-full pl-5 pr-12 py-3.5 text-slate-800 focus:ring-2 focus:ring-navy-500 focus:bg-white transition-all outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-navy-900 text-white rounded-full hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
