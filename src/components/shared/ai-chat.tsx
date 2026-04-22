'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useAiChat } from '@/hooks/use-ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageCircle, X, Send, Loader2, Sparkles,
  TrendingUp, ShoppingBag, Wrench, Building2,
  Users, FileText, Phone, MapPin, Tag, Mail,
  ExternalLink, CheckCircle2, Clock, Shield,
  ChevronRight, Bot, UserRound, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Utilities ───────────────────────────────────────────────────────────────

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SourceMetadata {
  fullName?: string;
  position?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  url?: string;
  [key: string]: any;
}

interface Source {
  type: string;
  relatedId: string;
  metadata: SourceMetadata;
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
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

// ─── Design Tokens ───────────────────────────────────────────────────────────

const THEME = {
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  { 
    icon: ShoppingBag, 
    text: 'Commodity market analysis', 
    category: 'Markets',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-100 hover:border-emerald-300'
  },
  { 
    icon: Building2, 
    text: 'Executive leadership team', 
    category: 'Corporate',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    hover: 'hover:bg-slate-100 hover:border-slate-300'
  },
  { 
    icon: Wrench, 
    text: 'Equipment & fleet services', 
    category: 'Operations',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100 hover:border-amber-300'
  },
  { 
    icon: TrendingUp, 
    text: 'Who is Nuhu Ibrahim Majidadi ?', 
    category: 'Leadership',
    color: 'text-blue-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    hover: 'hover:bg-green-100 hover:border-blue-300'
  },
];

const SOURCE_CONFIG: Record<string, {
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  border: string;
  badge: string;
}> = {
  LEADERSHIP: { 
    icon: Users, 
    label: 'Verified Leadership', 
    color: 'text-indigo-700', 
    bg: 'bg-indigo-50/80', 
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800'
  },
  ABOUT_CONTENT: { 
    icon: FileText, 
    label: 'Official Records', 
    color: 'text-slate-700', 
    bg: 'bg-slate-50/80', 
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-800'
  },
  CONTACT: { 
    icon: Phone, 
    label: 'Verified Contact', 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50/80', 
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800'
  },
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const RelevanceIndicator = memo(function RelevanceIndicator({ value }: { value: number }) {
  const width = Math.min(100, Math.max(0, value));
  
  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={cn(
            "h-full rounded-full",
            width > 80 ? "bg-emerald-500" : 
            width > 50 ? "bg-amber-500" : "bg-slate-400"
          )}
        />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider tabular-nums">
        {value}%
      </span>
    </div>
  );
});

const SourceCard = memo(function SourceCard({ source, index }: { source: Source; index: number }) {
  const cfg = SOURCE_CONFIG[source.type] || { 
    icon: Tag, 
    label: source.type, 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-50/80', 
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800'
  };
  const Icon = cfg.icon;
  const m = source.metadata;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "group relative p-4 rounded-xl border transition-all duration-300",
        "hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5",
        cfg.bg, cfg.border
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "p-2 rounded-lg bg-white border shadow-sm transition-transform duration-300 group-hover:scale-105",
            cfg.border
          )}>
            <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
          </div>
          <div className="flex flex-col">
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", cfg.color)}>
              {cfg.label}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ID: {source.relatedId.slice(0, 8)}...
            </span>
          </div>
        </div>
        <Shield className="h-3.5 w-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="space-y-1.5">
        {m.fullName && (
          <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
            {m.fullName}
          </p>
        )}
        {m.position && (
          <p className="text-xs text-slate-600 font-medium">{m.position}</p>
        )}
        {m.city && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2">
            <MapPin className="h-3 w-3 text-amber-500" /> 
            {m.city}{m.state ? `, ${m.state}` : ''}
          </div>
        )}
        {m.email && (
          <a 
            href={`mailto:${m.email}`}
            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <Mail className="h-3 w-3" />
            {m.email}
          </a>
        )}
      </div>
      <RelevanceIndicator value={source.relevance} />
    </motion.div>
  );
});

const FormattedContent = memo(function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n').filter(l => l.trim() !== '');

  return (
    <div className="space-y-2.5">
      {lines.map((line, idx) => {
        const isHeader = line.startsWith('##') || line.startsWith('**') && line.endsWith('**') && line.length < 50;
        const isList = /^\d+[.)]\s+|^\s*[-*•]\s+/.test(line);
        const cleanText = line.replace(/^\d+[.)]\s+|^\s*[-*•]\s+/, '').replace(/^##?\s*/, '');
        const number = line.match(/^(\d+)[.)]\s+/)?.[1];

        if (isHeader) {
          return (
            <h4 key={idx} className="text-sm font-bold text-slate-900 mt-4 first:mt-0">
              <TextParser text={cleanText} />
            </h4>
          );
        }

        if (isList) {
          return (
            <div key={idx} className="flex gap-3 items-start group/item">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100 group-hover/item:ring-emerald-200 transition-all" />
              <p className="text-sm text-slate-700 leading-relaxed">
                {number && <span className="font-semibold text-slate-900 mr-1">{number}.</span>}
                <TextParser text={cleanText} />
              </p>
            </div>
          );
        }

        return (
          <p key={idx} className="text-sm text-slate-700 leading-relaxed">
            <TextParser text={line} />
          </p>
        );
      })}
    </div>
  );
});

const TextParser = memo(function TextParser({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\+?\d[\d\s-]{8,}))/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</span>;
        }
        if (part.startsWith('[') && part.includes('](')) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" 
                className="inline-flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-emerald-300 underline-offset-2 transition-colors">
                {match[1]}
                <ExternalLink className="h-3 w-3" />
              </a>
            );
          }
        }
        if (part.includes('@') && part.includes('.')) {
          return (
            <a key={i} href={`mailto:${part}`} 
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              {part}
            </a>
          );
        }
        if (/^\+?\d[\d\s-]{8,}$/.test(part)) {
          return (
            <a key={i} href={`tel:${part.replace(/\s/g, '')}`} 
              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition-colors">
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
});

const MessageSkeleton = memo(function MessageSkeleton() {
  return (
    <div className="flex gap-3 items-start w-full">
      <div className="h-8 w-8 rounded-full bg-emerald-100 animate-pulse shrink-0" />
      <div className="space-y-2.5 flex-1 max-w-[80%]">
        <div className="h-3 bg-slate-100 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-slate-100 rounded-full w-full animate-pulse" />
        <div className="h-3 bg-slate-100 rounded-full w-5/6 animate-pulse" />
        <div className="h-3 bg-slate-100 rounded-full w-1/2 animate-pulse" />
      </div>
    </div>
  );
});

const SuggestedChip = memo(function SuggestedChip({ 
  item, 
  onClick, 
  index 
}: { 
  item: typeof SUGGESTED_QUESTIONS[0]; 
  onClick: () => void;
  index: number;
}) {
  const Icon = item.icon;
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200",
        "hover:shadow-md active:scale-95",
        item.bg, item.border, item.color, item.hover
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{item.text}</span>
      <ChevronRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
    </motion.button>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      role: 'assistant', 
      content: "Welcome to ROOTAF Enterprise Intelligence. I'm here to provide verified insights, market analysis, and professional support for your strategic inquiries.\n\nHow may I assist your organization today?",
      timestamp: new Date(),
    },
  ]);

  const chatMutation = useAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, chatMutation.isPending]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || chatMutation.isPending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const result = (await chatMutation.mutateAsync({ question })) as ApiResponse;
      const data = result?.data;
      
      setMessages(prev => prev.map(m => 
        m.id === userMsg.id ? { ...m, status: 'sent' } : m
      ));
      
      setMessages(prev => [...prev, { 
        id: `assistant-${Date.now()}`,
        role: 'assistant', 
        content: data?.answer || "I've processed your inquiry but couldn't locate specific data in our verified knowledge base. Please try rephrasing or ask about our core competencies: commodity markets, leadership, or operational services.", 
        sources: data?.sources,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => prev.map(m => 
        m.id === userMsg.id ? { ...m, status: 'error' } : m
      ));
      
      setMessages(prev => [...prev, { 
        id: `error-${Date.now()}`,
        role: 'assistant', 
        content: "I encountered a temporary system issue while processing your request. Our technical team has been notified. Please try again with additional context.",
        timestamp: new Date(),
      }]);
    }
  }, [input, chatMutation]);

  const formatTime = (date: Date) => 
    new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).format(date);

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl",
              "bg-gradient-to-br from-emerald-600 to-emerald-800",
              "text-white shadow-2xl shadow-emerald-900/20",
              "flex items-center justify-center",
              "border border-emerald-400/30",
              "hover:shadow-emerald-900/30 transition-shadow"
            )}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-emerald-700" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 inset-0 sm:inset-auto sm:bottom-0.5 sm:right-6",
              "w-full sm:w-[480px] h-[100dvh] sm:h-[720px]",
              "flex flex-col bg-white sm:rounded-3xl",
              "border border-slate-200/60 shadow-2xl shadow-slate-900/15",
              "overflow-hidden"
            )}
          >
            {/* Header */}
            <div className={cn(
              "relative px-6 py-5 shrink-0 overflow-hidden",
              "bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900",
              "border-b border-white/10"
            )}>
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
              
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-[0.03]" 
                style={{ 
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }} 
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={cn(
                      "h-11 w-11 rounded-xl",
                      "bg-gradient-to-br from-amber-300 to-amber-500",
                      "flex items-center justify-center shadow-lg shadow-amber-900/20",
                      "border border-amber-200/50"
                    )}>
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-emerald-900" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        ROOTAF Intelligence
                      </h3>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-amber-300 border border-white/10">
                        PRO
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-200/80">
                        Enterprise Support Active
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef} 
              className={cn(
                "flex-1 overflow-y-auto px-6 py-6 space-y-6",
                "bg-gradient-to-b from-slate-50/80 via-white to-white",
                "scroll-smooth"
              )}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className={cn(
                    "flex w-full",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    "max-w-[90%]",
                    msg.role === 'user' ? 'flex flex-row-reverse items-end gap-2.5' : 'flex items-start gap-2.5 w-full'
                  )}>
                    {/* Avatar */}
                    <div className={cn(
                      "shrink-0 h-8 w-8 rounded-full flex items-center justify-center border-2",
                      msg.role === 'user' 
                        ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                        : "bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-700 text-white shadow-md"
                    )}>
                      {msg.role === 'user' 
                        ? <UserRound className="h-4 w-4" />
                        : <Bot className="h-4 w-4" />
                      }
                    </div>

                    {/* Bubble */}
                    <div className="space-y-1 min-w-0">
                      <div className={cn(
                        "relative px-4 py-3 rounded-2xl shadow-sm",
                        msg.role === 'user'
                          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-br-sm"
                          : "bg-white border border-slate-200/80 rounded-tl-sm"
                      )}>
                        {msg.role === 'user' ? (
                          <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="space-y-4">
                            <FormattedContent content={msg.content} />
                            
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-6 pt-5 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                                    Verified Sources
                                  </p>
                                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                    {msg.sources.length}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-2.5">
                                  {msg.sources.map((s, idx) => (
                                    <SourceCard key={idx} source={s} index={idx} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Meta */}
                      <div className={cn(
                        "flex items-center gap-1.5 px-1",
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.role === 'user' && msg.status === 'sent' && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        )}
                        {msg.role === 'user' && msg.status === 'error' && (
                          <span className="text-[10px] text-red-500 font-medium">Failed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {chatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 items-center text-slate-500"
                >
                  <MessageSkeleton />
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="px-5 py-4 bg-white border-t border-slate-100 shrink-0 space-y-3">
              {/* Suggested Questions */}
              {messages.length <= 2 && !chatMutation.isPending && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((sq, i) => (
                    <SuggestedChip 
                      key={i} 
                      item={sq} 
                      index={i}
                      onClick={() => handleSend(sq.text)} 
                    />
                  ))}
                </div>
              )}

              <form 
                onSubmit={e => { e.preventDefault(); handleSend(); }} 
                className="flex gap-2.5 items-end"
              >
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about markets, leadership, operations..."
                    className={cn(
                      "h-11 pl-4 pr-10 rounded-xl",
                      "bg-slate-50 border-slate-200",
                      "focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400",
                      "font-medium text-slate-700 placeholder:text-slate-400 text-sm",
                      "transition-all"
                    )}
                  />
                  {input.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={!input.trim() || chatMutation.isPending}
                  className={cn(
                    "h-11 w-11 rounded-xl shrink-0",
                    "bg-gradient-to-br from-emerald-600 to-emerald-700",
                    "hover:from-emerald-700 hover:to-emerald-800",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "shadow-lg shadow-emerald-900/10 hover:shadow-xl hover:shadow-emerald-900/20",
                    "transition-all active:scale-95"
                  )}
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <Zap className="h-3 w-3 text-amber-500" />
                <span>ROOTAF Enterprise Intelligence • Verified Data Only</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}