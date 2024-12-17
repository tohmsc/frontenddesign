"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { Brain, ChevronRight, Loader2, Check, Code, Bot, HelpCircle, Terminal, Settings2, Sparkles, Zap, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { create } from 'zustand'
import { FamilyButton } from "@/components/ui/family-button"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { ParticleLogo } from './particle-logo';

interface StatusStore {
  status: string
  setStatus: (status: string) => void
}

export const useStatusStore = create<StatusStore>((set) => ({
  status: 'Ready',
  setStatus: (status) => set({ status }),
}))

interface Action {
  id: string
  text: string
  status: 'loading' | 'complete' | 'ready'
  description?: string
  command?: string
  isExpanded?: boolean
  checked?: boolean
}

interface ThoughtNode {
  id: string;
  thoughtNumber: number;
  thoughtType: 'understanding' | 'gathering' | 'decomposition' | 'solution';
  content: string;
  timestamp: string;
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'progress' | 'thought'
  content: string
  timestamp: string
  actions?: Action[]
  thoughts?: ThoughtNode[]
}

interface ChatMessageProps {
  message: Message
  onActionClick?: (actionId: string) => void
}

const messageVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 10,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

function ActionButton({ action, onClick }: { action: Action; onClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative overflow-hidden h-[48px]",
        "rounded-xl backdrop-blur-sm",
        "border transition-all duration-200",
        "hover:bg-gradient-to-b hover:from-primary/[0.05] hover:to-transparent",
        action.status === 'complete' ? "border-primary/20" :
        action.status === 'loading' ? "border-secondary/20" :
        "border-white/[0.08] hover:border-primary/20"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full p-3 flex items-center"
      >
        <div className="flex items-center gap-3 w-full">
          <div className={cn(
            "relative flex h-6 w-6 shrink-0 items-center justify-center",
            "rounded-lg transition-colors duration-300",
            "bg-gradient-to-b from-primary/10 to-primary/5",
            "group-hover:from-primary/20 group-hover:to-primary/10"
          )}>
            {action.status === 'complete' ? (
              <Check className="h-3 w-3 text-primary" />
            ) : action.status === 'loading' ? (
              <Loader2 className="h-3 w-3 text-secondary animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-medium tracking-wide transition-colors line-clamp-1",
                "group-hover:text-[#070F0C]",
                action.status === 'complete' ? "text-[#070F0C]" :
                action.status === 'loading' ? "text-[#070F0C]" :
                "text-[#070F0C]/90"
              )}>
                {action.text}
              </span>
            </div>
            {action.description && (
              <p className={cn(
                "text-xs font-light tracking-wide transition-colors line-clamp-1",
                "group-hover:text-[#070F0C]/70",
                action.status === 'complete' ? "text-[#070F0C]/60" :
                action.status === 'loading' ? "text-[#070F0C]/60" :
                "text-[#070F0C]/50"
              )}>
                {action.description}
              </p>
            )}
          </div>

          <div className={cn(
            "flex h-6 w-6 items-center justify-center",
            "opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100"
          )}>
            <ArrowRight className="h-3 w-3 text-primary" />
          </div>
        </div>
      </button>
    </motion.div>
  );
}

function ChatMessage({ message, onActionClick }: ChatMessageProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "relative group",
        message.role === 'assistant' && [
          'px-6 py-4',
          'bg-[#F7FBF9]/90 backdrop-blur-xl',
          'border-b border-[#070F0C]/[0.03]',
          'mb-1'
        ],
        message.role === 'progress' && [
          'px-6 py-3',
          'bg-[#F7FBF9]/90 backdrop-blur-xl',
          'border-b border-[#070F0C]/[0.03]',
          'mb-1'
        ],
        message.role === 'user' && [
          'px-6 py-4',
          'bg-[#F7FBF9]/70 backdrop-blur-xl',
          'border-b border-[#070F0C]/[0.03]',
          'mb-1'
        ]
      )}
    >
      {/* User message */}
      {message.role === 'user' && (
        <div className="flex items-start gap-4">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
            <div className="absolute inset-0 rounded-xl border border-primary/10" />
            <div className="relative h-4 w-4 text-primary font-medium">U</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm leading-relaxed tracking-wide text-[#070F0C]/90">
              {message.content}
            </div>
          </div>
        </div>
      )}

      {/* Assistant message */}
      {message.role === 'assistant' && (
        <div className="flex items-start gap-4">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
            <div className="absolute inset-0 rounded-xl border border-primary/10" />
            <Check className="relative h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-medium tracking-wider text-[#070F0C]/60 uppercase">
                  Update
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#070F0C]/5 to-transparent" />
                <div className="text-[11px] tabular-nums font-medium tracking-wider text-[#070F0C]/40">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Content */}
              <div className="text-sm leading-relaxed tracking-wide text-[#070F0C]/90">
                {message.content}
              </div>

              {/* Actions */}
              {message.actions && message.actions.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {message.actions.map((action) => (
                    <ActionButton
                      key={action.id}
                      action={action}
                      onClick={() => onActionClick?.(action.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress message */}
      {message.role === 'progress' && (
        <div className="flex items-start gap-4">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-secondary/10 via-secondary/5 to-transparent" />
            <div className="absolute inset-0 rounded-xl border border-secondary/10" />
            <Settings2 className="relative h-4 w-4 text-secondary animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-medium tracking-wider text-[#070F0C]/60 uppercase">
                  Processing
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#070F0C]/5 to-transparent" />
                <div className="text-[11px] tabular-nums font-medium tracking-wider text-[#070F0C]/40">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Content */}
              <div className="text-sm leading-relaxed tracking-wide text-[#070F0C]/90">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thought process */}
      {message.role === 'thought' && message.thoughts && (
        <ThoughtProcess 
          thoughts={message.thoughts} 
          onComplete={onComplete}
        />
      )}
    </motion.div>
  );
}

type AIStatus = 'thinking' | 'building' | 'responding' | 'waiting';

function AIStatusIndicator({ status }: { status: AIStatus }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#070F0C]/5">
      <div className="relative flex items-center">
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === 'thinking' && "bg-secondary",
          status === 'building' && "bg-primary",
          status === 'responding' && "bg-accent",
          status === 'waiting' && "bg-[#070F0C]/20"
        )}>
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              status === 'thinking' && "bg-secondary",
              status === 'building' && "bg-primary",
              status === 'responding' && "bg-accent",
              status === 'waiting' && "bg-[#070F0C]/20"
            )}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={status !== 'waiting' ? {
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            } : {
              scale: 1,
              opacity: 0.5
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      <span className={cn(
        "text-xs font-medium capitalize",
        status === 'thinking' && "text-[#070F0C]",
        status === 'building' && "text-[#070F0C]",
        status === 'responding' && "text-[#070F0C]",
        status === 'waiting' && "text-[#070F0C]/40"
      )}>
        {status}
      </span>
    </div>
  );
}

export function ChatIslandDemo(): React.ReactElement {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentAIStatus, setCurrentAIStatus] = React.useState<AIStatus>('waiting');
  const [isThinking, setIsThinking] = React.useState(false);
  const [input, setInput] = React.useState('');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const setStatus = useStatusStore((state) => state.setStatus);

  const scrollToBottom = React.useCallback(() => {
    if (!messagesEndRef.current) return;
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const updateMessages = React.useCallback((newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    setStatus('Processing your request...');
    setCurrentAIStatus('thinking');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateMessages(userMessage);
    setInput('');
    setIsThinking(true);

    // Add thought process message
    const thoughtProcess: Message = {
      id: `thought-${Date.now()}`,
      role: 'thought',
      content: 'Processing your request...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thoughts: [
        {
          id: 'thought-1',
          thoughtNumber: 1,
          thoughtType: 'understanding',
          content: 'Analyzing your request and planning the solution',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'thought-2',
          thoughtNumber: 2,
          thoughtType: 'subtask',
          content: 'Parsing input parameters and requirements',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'thought-3',
          thoughtNumber: 3,
          thoughtType: 'subtask',
          content: 'Checking dependencies and constraints',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'thought-4',
          thoughtNumber: 4,
          thoughtType: 'subtask',
          content: 'Validating proposed solution approach',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    updateMessages(thoughtProcess);

    // Simulate AI response after thoughts
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've processed your request. Here's what we can do:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            id: 'action-1',
            text: 'Analyze Code',
            status: 'ready',
            description: 'Review and suggest improvements',
            isExpanded: true,
            checked: false
          },
          {
            id: 'action-2',
            text: 'Generate Tests',
            status: 'ready',
            description: 'Create test cases',
            isExpanded: false,
            checked: false
          }
        ]
      };
      updateMessages(aiMessage);
      setIsThinking(false);
      setCurrentAIStatus('waiting');
      setStatus('Ready');
    }, 4000); // Adjusted timing to match thought process duration
  }, [input, isThinking, setStatus, updateMessages]);

  const handleActionClick = React.useCallback((actionId: string) => {
    setIsThinking(true);
    setCurrentAIStatus('building');
    
    const progressMessage: Message = {
      id: Date.now().toString(),
      role: 'progress',
      content: 'Processing your request...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateMessages(progressMessage);

    setTimeout(() => {
      setIsThinking(false);
      setCurrentAIStatus('waiting');
      setStatus('Ready');
    }, 800);
  }, [setStatus, updateMessages]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }, [handleSubmit, input]);

  // Status effect remains the same
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      setCurrentAIStatus('waiting');
      return;
    }

    if (lastMessage.role === 'user') {
      setCurrentAIStatus('thinking');
    } else if (lastMessage.role === 'progress') {
      setCurrentAIStatus('building');
    } else if (lastMessage.role === 'assistant') {
      setCurrentAIStatus('responding');
    } else {
      setCurrentAIStatus('waiting');
    }
  }, [messages]);

  return (
    <div className="relative h-full flex flex-col bg-[#F7FBF9]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#070F0C]/5 bg-gradient-to-b from-[#F7FBF9] to-[#F7FBF9]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-[50px] h-[50px]">
            <ParticleLogo />
          </div>
          <span className="text-sm font-medium text-[#070F0C]">New Software</span>
          <AIStatusIndicator status={currentAIStatus} />
        </div>
      </div>
      
      {/* Messages container with noise texture */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 bg-[#F7FBF9] [background-image:url('/noise.png')] bg-repeat"
      >
        <div className="max-w-2xl mx-auto space-y-4"> {/* Reduced max-width and spacing */}
          <AnimatePresence mode="wait">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  "group relative",
                  message.role === 'user' ? "mb-6" : "mb-8" // Reduced spacing
                )}
              >
                {/* Message bubble */}
                <div className={cn(
                  "relative w-full rounded-xl p-4", // Reduced padding and border radius
                  message.role === 'user' ? "" :
                  message.role === 'progress' ? "bg-gradient-to-br from-secondary/[0.03] to-transparent border border-secondary/5" :
                  message.role === 'thought' ? "bg-gradient-to-br from-primary/[0.03] to-transparent border border-primary/5" :
                  "bg-gradient-to-br from-accent/[0.03] to-transparent border border-accent/5"
                )}>
                  {/* Message header - Only show for non-user messages */}
                  {message.role !== 'user' && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn(
                        "text-[10px] font-medium tracking-wider uppercase",
                        "text-[#070F0C]/60"
                      )}>
                        {message.role === 'progress' ? 'Processing' :
                         message.role === 'thought' ? 'Thinking' :
                         'Update'}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#070F0C]/5 to-transparent" />
                      <div className="text-[10px] tabular-nums font-medium tracking-wider text-[#070F0C]/40">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )}

                  {/* Message content with improved typography */}
                  {message.role === 'thought' && message.thoughts ? (
                    <ThoughtProcess 
                      thoughts={message.thoughts} 
                      onComplete={() => {
                        const aiMessage: Message = {
                          id: Date.now().toString(),
                          role: 'assistant',
                          content: "Based on my analysis, here's what we'll do:",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          actions: [
                            {
                              id: Date.now().toString(),
                              text: 'Implement Solution',
                              status: 'complete',
                              description: 'Ready to proceed with implementation',
                              command: 'implement',
                              isExpanded: false,
                              checked: true
                            }
                          ]
                        }
                        updateMessages(aiMessage)
                        setIsThinking(false)
                        setStatus('Ready')
                      }}
                    />
                  ) : (
                    <div className={cn(
                      "text-sm leading-relaxed tracking-wide", // Reduced font size
                      "text-[#070F0C]/90"
                    )}>
                      {message.content}
                    </div>
                  )}

                  {/* Actions grid with improved spacing */}
                  {message.role !== 'user' && message.actions && message.actions.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-4"> {/* Reduced gap */}
                      {message.actions.map((action) => (
                        <ActionButton
                          key={action.id}
                          action={action}
                          onClick={() => handleActionClick(action.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div ref={messagesEndRef} className="h-6" /> {/* Reduced bottom padding */}
      </div>

      {/* Input area with modern gradient - Less glow, more prominent */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F7FBF9] via-[#F7FBF9]/95 to-transparent backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4B84FF] via-[#A1C6D0] to-[#7A9BBC] rounded-xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative">
            <div className="absolute left-4 top-4">
              <Sparkles className="h-5 w-5 text-[#070F0C]/50" />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like me to help with?"
              aria-label="Message input"
              disabled={isThinking}
              className={cn(
                "w-full min-h-[84px] pl-12 pr-4 py-3",
                "bg-[#F7FBF9] backdrop-blur-xl",
                "border-2 border-[#070F0C]/10",
                "rounded-xl resize-none",
                "text-sm text-[#070F0C]",
                "placeholder:text-[#070F0C]/40",
                "focus:outline-none focus:ring-0 focus:border-[#4B84FF]/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200",
                "shadow-sm"
              )}
            />
            <div className="absolute right-4 bottom-4 flex items-center gap-2 text-[#070F0C]/40">
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#070F0C]/[0.06]">⌘</kbd>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#070F0C]/[0.06]">Enter</kbd>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function ThoughtProcess({ thoughts, onComplete }: { thoughts: ThoughtNode[]; onComplete?: () => void }) {
  const [activeThought, setActiveThought] = React.useState(0);
  const [isCompleting, setIsCompleting] = React.useState(false);

  React.useEffect(() => {
    if (activeThought >= thoughts.length && !isCompleting) {
      setIsCompleting(true);
      onComplete?.();
      return;
    }

    if (activeThought < thoughts.length) {
      const timer = setTimeout(() => {
        setActiveThought(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeThought, thoughts, thoughts.length, isCompleting, onComplete]);

  // Group thoughts by type to show main task and subtasks
  const mainTask = thoughts[0];
  const subtasks = thoughts.slice(1);

  return (
    <div className="relative py-1">
      {/* Progress bar */}
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/40 via-primary/30 to-primary/20"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(activeThought + 1, thoughts.length) / thoughts.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      <div className="space-y-3 mt-3">
        {/* Main task */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 px-2 py-2 rounded-lg bg-primary/[0.03] border border-primary/5"
        >
          <div className="relative flex h-4 w-4 shrink-0 items-center justify-center mt-0.5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-primary/20"
            >
              <motion.div 
                className="absolute inset-0 rounded-full border border-primary/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm leading-relaxed tracking-wide text-[#070F0C]/90">
              {mainTask.content}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#070F0C]/40 font-medium mt-1">
              {mainTask.thoughtType}
            </div>
          </div>
        </motion.div>

        {/* Subtasks */}
        <div className="pl-6 space-y-2">
          {subtasks.map((thought, index) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: index < activeThought ? 1 : 0.4,
                x: 0
              }}
              transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.1 }}
              className={cn(
                "flex items-start gap-2 px-2 py-1.5 rounded-lg transition-all",
                index === activeThought - 1 && "bg-gradient-to-r from-primary/[0.02] to-transparent",
                index < activeThought - 1 && "opacity-80"
              )}
            >
              {/* Status icon */}
              <div className="relative flex h-3 w-3 shrink-0 items-center justify-center mt-0.5">
                {index < activeThought - 1 ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-1.5 w-1.5 rounded-full bg-primary/40"
                  />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/10" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm leading-relaxed tracking-wide",
                  index < activeThought - 1 ? "text-[#070F0C]/70" : "text-[#070F0C]/40"
                )}>
                  {thought.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}