'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAiChat } from '@/hooks/use-ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  MessageCircle, X, Send, Loader2, Bot, User, Sparkles,
  TrendingUp, ShoppingBag, Wrench, Building2, HelpCircle,
  Users, FileText, Phone, MapPin, Tag, ChevronDown, ChevronUp, Mail, ExternalLink
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Source {
  type: string;
  relatedId: string;
  metadata: Record<string, any>;
  relevance: number;
}

interface AiResponse {
  answer: string;
  sources: Source[];
}

interface ApiResponse {
  success?: boolean;
  data?: AiResponse;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  { icon: ShoppingBag, text: 'Commodity market analysis', color: 'text-emerald-600' },
  { icon: Building2, text: 'Executive leadership team', color: 'text-slate-600' },
  { icon: Wrench, text: 'Equipment & fleet services', color: 'text-amber-600' },
];

const SOURCE_CONFIG: Record<string, any> = {
  LEADERSHIP: { icon: Users, label: 'Verified Leadership', color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
  ABOUT_CONTENT: { icon: FileText, label: 'Official Records', color: 'text-slate-600', bg: 'bg-slate-50/50', border: 'border-slate-100' },
  CONTACT: { icon: Phone, label: 'Verified Contact', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
};

// ─── Visual Components ────────────────────────────────────────────────────────

function RelevanceIndicator({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-transparent overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700 shadow-sm" 
          style={{ width: `${value}%` }} 
        />
      </div>
      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{value}%</span>
    </div>
  );
}

function SourceCard({ source }: { source: Source }) {
  const cfg = SOURCE_CONFIG[source.type] || { icon: Tag, label: source.type, color: 'text-emerald-600', bg: 'bg-emerald-50/70', border: 'border-emerald-100' };
  const Icon = cfg.icon;
  const m = source.metadata;

  return (
    <div className={`p-4 rounded-xl border ${cfg.bg} ${cfg.border} transition-all hover:shadow-lg hover:border-emerald-200 group cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/80 border ${cfg.border} group-hover:bg-white transition-colors`}>
            <Icon className={`h-4 w-4 ${cfg.color}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {m.fullName && <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">{m.fullName}</p>}
        {m.position && <p className="text-xs text-slate-600 font-medium">{m.position}</p>}
        {m.city && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-amber-500" /> {m.city}, {m.state}
          </div>
        )}
      </div>
      <RelevanceIndicator value={source.relevance} />
    </div>
  );
}

// ─── Message Formatting ───────────────────────────────────────────────────────

function FormattedContent({ content }: { content: string }) {
  // Enhanced parser for professional display
  const lines = content.split('\n').filter(l => l.trim() !== '');

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        // Detect bullet/numbered items
        const isList = /^\d+[.)]\s+|^\s*[-*•]\s+/.test(line);
        const cleanText = line.replace(/^\d+[.)]\s+|^\s*[-*•]\s+/, '');

        if (isList) {
          return (
            <div key={idx} className="flex gap-3 group">
              <div className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 group-hover:scale-125 transition-transform" />
              <p className="text-sm text-slate-700 leading-relaxed"><TextParser text={cleanText} /></p>
            </div>
          );
        }

        return <p key={idx} className="text-sm text-slate-700 leading-relaxed font-medium"><TextParser text={line} /></p>;
      })}
    </div>
  );
}

function TextParser({ text }: { text: string }) {
  // Regex to catch emails, phones, and bold text
  const parts = text.split(/(\*\*[^*]+\*\*|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\+?\d[\d\s-]{8,}))/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</span>;
        }
        if (part.includes('@')) {
          return (
            <a key={i} href={`mailto:${part}`} className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors">
              {part}
              <Mail className="h-3 w-3" />
            </a>
          );
        }
        if (/^\+?\d[\d\s-]{8,}$/.test(part)) {
          return (
            <a key={i} href={`tel:${part}`} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:underline font-semibold transition-colors">
              {part}
              <Phone className="h-3 w-3" />
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

// ─── Main Chat Interface ───────────────────────────────────────────────────────

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to ROOTAF Enterprise Intelligence. I'm here to provide verified insights and professional support for your inquiries." },
  ]);

  const chatMutation = useAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSend = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || chatMutation.isPending) return;

    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setInput('');

    try {
      const result = (await chatMutation.mutateAsync({ question })) as ApiResponse;
      const data = result?.data;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data?.answer || "Inquiry processed, but no specific data was found.", 
        sources: data?.sources 
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a temporary issue processing your request. Please try again with additional details." }]);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-2 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center border border-emerald-400/50"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {isOpen && (
        <div className="fixed z-50 inset-0 sm:inset-auto sm:bottom-0.5 sm:right-8 w-full sm:w-[540px] h-[100dvh] sm:max-h-[680px] flex flex-col bg-white sm:rounded-2xl sm:border border-emerald-200/80 shadow-[0_25px_60px_rgba(0,0,0,0.18)] overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-emerald-650 to-emerald-700 text-white flex items-center justify-between shrink-0 border-b border-emerald-500/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-300 to-amber-400 bg-opacity-20 flex items-center justify-center border border-amber-300/40 shadow-lg">
                <Sparkles className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">ROOTAF Intelligence</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-200/90">
                  <div className="h-2 w-2 rounded-full bg-amber-300 animate-pulse shadow-sm" />
                  Enterprise Support
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white hover:bg-emerald-700/50 rounded-lg transition-all">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-7 bg-gradient-to-b from-emerald-50/30 to-white scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md hover:shadow-lg transition-shadow' : 'w-full'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-5">
                      <div className="bg-white border border-emerald-100/70 px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm hover:shadow-md transition-all">
                        <FormattedContent content={msg.content} />
                        
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-emerald-100/50">
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4">Verified Sources & References</p>
                            <div className="grid grid-cols-1 gap-3">
                              {msg.sources.map((s, idx) => <SourceCard key={idx} source={s} />)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-3 items-center text-emerald-700 text-sm font-semibold animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" /> Processing inquiry...
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="px-6 py-5 bg-white border-t border-emerald-100 shrink-0">
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_QUESTIONS.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq.text)}
                  className="text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-all bg-white text-slate-700 shadow-sm hover:shadow-md"
                >
                  {sq.text}
                </button>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything about ROOTAF..."
                className="flex-1 h-11 bg-emerald-50/60 border-emerald-200 rounded-lg focus-visible:ring-emerald-400 font-medium text-slate-700 placeholder:text-slate-500 text-sm"
              />
              <Button type="submit" disabled={!input.trim() || chatMutation.isPending} className="h-11 w-11 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shrink-0 shadow-md hover:shadow-lg transition-all">
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
