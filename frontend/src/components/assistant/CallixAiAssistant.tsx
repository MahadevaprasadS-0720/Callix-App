import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  X, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Bot,
  User,
  ExternalLink,
  RotateCcw,
  Cpu
} from 'lucide-react';
import { apiService } from '../../services/apiService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestedActions?: string[];
  timestamp: number;
  model?: string;
  engine?: string;
  latencyMs?: number;
}

interface CallixAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  'Who won 2011 Cricket World Cup?',
  'Explain Digital Arrest scams',
  'Who has 100 international centuries?',
  'Explain SIM Swapping',
  'How to report to 1930 / Chakshu',
  'Analyze a suspicious SMS'
];

export const CallixAiAssistant: React.FC<CallixAiAssistantProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      text: "Hello! I am **Callix AI**, your versatile open-world and cyber defense assistant.\n\nAsk me anything—from sports, cricket, technology, and science, to investigating suspicious callers, decrypting SMS extortion patterns, and safeguarding your communications.",
      suggestedActions: [
        'Who won 2011 Cricket World Cup?',
        'Analyze a suspicious SMS',
        'Explain Digital Arrest scams',
        'How to report to 1930 / Chakshu'
      ],
      timestamp: Date.now(),
      model: 'callix-defense-core',
      engine: 'Callix Multimodal Shield'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
      if (initialPrompt && initialPrompt.trim()) {
        handleSendMessage(initialPrompt.trim());
      }
    }
  }, [isOpen, initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Build history for Callix AI
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome_msg')
        .slice(-6)
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        }));

      const res = await apiService.askAiAssistant({
        message: query,
        chat_history: chatHistory,
      });

      const elapsed = Date.now() - startTime;

      const aiMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        text: res.reply || `I have analyzed your query regarding "${query}". Let me know if you would like deeper details or further analysis.`,
        suggestedActions: res.suggested_actions || [],
        timestamp: Date.now(),
        model: res.model || 'callix-defense-core',
        engine: res.engine || 'Callix Multimodal Shield',
        latencyMs: elapsed,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          text: "I am actively monitoring the cyber threat landscape. Always remember: Never disclose bank OTPs, disregard video arrest threats from callers claiming to be Mumbai Police or Customs, and report suspicious numbers to India's 1930 portal.",
          suggestedActions: [
            'Report on Cybercrime Helpline 1930',
            'Block number immediately',
            'Check caller in Callix Lookup'
          ],
          timestamp: Date.now(),
          model: 'offline-cyber-knowledge',
          engine: 'Callix Shield Knowledge Base'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome_msg_reset',
        role: 'assistant',
        text: "Conversation reset. What suspect caller or cyber threat can I help investigate?",
        suggestedActions: [
          'Analyze a suspicious SMS',
          'Explain SIM Swapping',
          'Digital Arrest scam warning'
        ],
        timestamp: Date.now(),
        model: 'callix-defense-core',
        engine: 'Callix Multimodal Shield'
      }
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-over Liquid Glass Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              className="w-screen max-w-md sm:max-w-lg flex flex-col bg-neutral-950/85 backdrop-blur-2xl border-l border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.2)] text-white"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.03] backdrop-blur-md relative">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm tracking-tight text-white">Callix AI Assistant</h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-[10px] font-mono text-indigo-300 font-semibold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        ACTIVE SHIELD
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Elite Voice Cyber Defense & Threat Intelligence
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    title="Clear Conversation History"
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close Assistant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Prompts Carousel Bar */}
              <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.015] overflow-x-auto no-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> Prompts:
                </span>
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message Stream */}
              <div ref={scrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 px-1">
                        {isUser ? (
                          <>
                            <span>You</span>
                            <User className="w-3 h-3 text-cyan-400" />
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span>Callix Cyber Shield</span>
                            {msg.latencyMs && (
                              <span className="text-zinc-500">• {msg.latencyMs}ms</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Frosted Bubble */}
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed backdrop-blur-md shadow-md ${
                          isUser
                            ? 'bg-gradient-to-br from-cyan-600/40 via-indigo-600/40 to-cyan-700/30 border border-cyan-400/30 text-white rounded-br-xs'
                            : 'bg-white/[0.06] border border-white/15 text-zinc-100 rounded-bl-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]'
                        }`}
                      >
                        <div className="whitespace-pre-wrap space-y-2">
                          {msg.text.split('\n\n').map((paragraph, idx) => (
                            <p key={idx}>
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {/* Suggested Actions Buttons */}
                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-white/10 space-y-1.5">
                            <div className="text-[10px] font-mono uppercase text-indigo-300 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Recommended Defense Actions:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedActions.map((action, aIdx) => (
                                <button
                                  key={aIdx}
                                  type="button"
                                  onClick={() => handleSendMessage(`Tell me how to: ${action}`)}
                                  className="text-left px-2.5 py-1 rounded-lg text-[11px] font-medium text-zinc-200 bg-white/10 hover:bg-indigo-500/25 border border-white/15 hover:border-indigo-400/40 transition-all cursor-pointer active:scale-95 flex items-center gap-1 group"
                                >
                                  <span>{action}</span>
                                  <ArrowRight className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-300" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 w-fit text-xs text-zinc-300 backdrop-blur-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Callix AI analyzing threat telemetry...</span>
                  </motion.div>
                )}
              </div>

              {/* Footer Input Area */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2 bg-neutral-900/90 border border-white/15 focus-within:border-cyan-400/50 rounded-2xl p-2 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                >
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about a scam, phone call, or threat pattern..."
                    className="flex-1 bg-transparent px-2.5 py-1 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none resize-none max-h-28"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95 shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 fill-black text-black" />
                  </button>
                </form>

                <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-zinc-400 font-mono">
                  <span>Enter to send • Shift+Enter for newline</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> Zero data retention
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
