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
        "rounded-xl border bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-200",
        action.status === 'complete' ? "border-emerald-500/20" :
        action.status === 'loading' ? "border-amber-500/20" :
        "border-white/[0.08] hover:border-white/[0.12]",
        action.isExpanded && "ring-1",
        action.status === 'complete' ? "ring-emerald-500/20" :
        action.status === 'loading' ? "ring-amber-500/20" :
        "ring-white/[0.08]"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
              action.status === 'complete' ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20" :
              action.status === 'loading' ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20" :
              "bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
            )}
          >
            {action.status === 'complete' && <Check className="h-4 w-4" />}
            {action.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            {action.status === 'ready' && <Sparkles className="h-4 w-4" />}
            {action.text}
          </button>
        </div>
      </div>

      {action.isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={cn(
            "border-t bg-black/60",
            action.status === 'complete' ? "border-emerald-500/10" :
            action.status === 'loading' ? "border-amber-500/10" :
            "border-white/[0.04]"
          )}
        >
          <div className="flex flex-col gap-1 p-3">
            {action.description && (
              <div className={cn(
                "text-xs",
                action.status === 'complete' ? "text-emerald-300/70" :
                action.status === 'loading' ? "text-amber-300/70" :
                "text-blue-300/70"
              )}>
                {action.description}
              </div>
            )}
            {action.command && (
              <div className="font-mono text-xs text-white/60">
                <span className={cn(
                  action.status === 'complete' ? "text-emerald-400/90" :
                  action.status === 'loading' ? "text-amber-400/90" :
                  "text-cyan-400/90"
                )}>
                  {action.command}
                </span>
              </div>
            )}
            {action.status === 'complete' && (
              <div className="font-mono text-xs text-emerald-400/90 flex items-center gap-2">
                <Check className="h-3 w-3" />
                Operation completed
              </div>
            )}
            {action.status === 'loading' && (
              <div className="font-mono text-xs text-amber-400/90 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Processing...
              </div>
            )}
          </div>
        </motion.div>
      )}
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
          'bg-black/40 backdrop-blur-xl',
          'border-b border-white/[0.03]',
          'mb-1'
        ],
        message.role === 'progress' && [
          'px-6 py-3',
          'bg-black/40 backdrop-blur-xl',
          'border-b border-white/[0.03]',
          'mb-1'
        ],
        message.role === 'user' && [
          'px-6 py-4',
          'bg-black/20 backdrop-blur-xl',
          'border-b border-white/[0.03]',
          'mb-1'
        ]
      )}
    >
      {message.role === 'assistant' && (
        <div className="flex items-start gap-3">
          <FamilyButton>
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </FamilyButton>
          <div className="flex-1">
            <div className="text-sm font-medium text-white/90">
              {message.content}
            </div>
            {message.actions && message.actions.length > 0 && (
              <div className="mt-4 space-y-2">
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
      )}

      {message.role === 'progress' && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/30 border border-white/[0.05]">
            <Settings2 className="h-5 w-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">
              {message.content}
            </div>
          </div>
        </div>
      )}

      {message.role === 'user' && (
        <div className="text-sm text-white/90 pl-[52px]">
          {message.content}
        </div>
      )}
    </motion.div>
  );
}

type AIStatus = 'thinking' | 'building' | 'responding' | 'waiting';

function AIStatusIndicator({ status }: { status: AIStatus }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-500/10">
      <div className="relative flex items-center">
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === 'thinking' && "bg-amber-400",
          status === 'building' && "bg-emerald-400",
          status === 'responding' && "bg-blue-400",
          status === 'waiting' && "bg-slate-400"
        )}>
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              status === 'thinking' && "bg-amber-400",
              status === 'building' && "bg-emerald-400",
              status === 'responding' && "bg-blue-400",
              status === 'waiting' && "bg-slate-400"
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
        status === 'thinking' && "text-amber-400",
        status === 'building' && "text-emerald-400",
        status === 'responding' && "text-blue-400",
        status === 'waiting' && "text-slate-400"
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
          content: 'Analyzing your request...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'thought-2',
          thoughtNumber: 2,
          thoughtType: 'gathering',
          content: 'Gathering context and information...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'thought-3',
          thoughtNumber: 3,
          thoughtType: 'decomposition',
          content: 'Breaking down the problem...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'thought-4',
          thoughtNumber: 4,
          thoughtType: 'solution',
          content: 'Formulating the solution...',
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
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've completed the action. Here's what happened:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            id: 'result-1',
            text: 'View Results',
            status: 'complete',
            description: 'See the changes made',
            isExpanded: true,
            checked: true
          }
        ]
      };
      updateMessages(aiMessage);
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
    <div className="relative h-full flex flex-col bg-[#0C0C0D]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative w-[50px] h-[50px]">
            <ParticleLogo />
          </div>
          <span className="text-sm font-medium text-neutral-200">New Software</span>
          <AIStatusIndicator status={currentAIStatus} />
        </div>
        {/* ... rest of header content ... */}
      </div>
      
      {/* Messages with improved spacing */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="space-y-8"> {/* Increased space between message groups */}
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
                  message.role === 'user' ? "mb-6" : "mb-8" // Additional spacing after messages
                )}
              >
                {/* Message bubble */}
                <div className={cn(
                  "relative w-full rounded-xl p-4",
                  message.role === 'user' ? "py-2" :
                  message.role === 'progress' ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-xl border border-amber-500/10" :
                  message.role === 'thought' ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-xl border border-blue-500/10" :
                  "bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 backdrop-blur-xl border border-emerald-500/10"
                )}>
                  {/* Update indicator - Only show for non-user messages */}
                  {message.role !== 'user' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "p-1 rounded-lg",
                        message.role === 'progress' ? "bg-amber-500/10" :
                        message.role === 'thought' ? "bg-blue-500/10" :
                        "bg-emerald-500/10"
                      )}>
                        {message.role === 'progress' ? (
                          <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                        ) : message.role === 'thought' ? (
                          <Brain className="h-3.5 w-3.5 text-blue-400" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs",
                        message.role === 'progress' ? "text-amber-400/80" :
                        message.role === 'thought' ? "text-blue-400/80" :
                        "text-emerald-400/80"
                      )}>
                        {message.role === 'progress' ? 'Processing' :
                         message.role === 'thought' ? 'Thinking' :
                         'Update'}
                      </span>
                    </div>
                  )}

                  {/* Message content */}
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
                      "text-sm leading-relaxed",
                      message.role === 'user' ? "text-white/80 pl-1" :
                      message.role === 'progress' ? "text-amber-50/90" :
                      message.role === 'thought' ? "text-blue-50/90" :
                      "text-emerald-50/90"
                    )}>
                      {message.content}
                    </div>
                  )}

                  {/* Actions - Only show for non-user messages */}
                  {message.role !== 'user' && message.actions && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-2"
                    >
                      {message.actions.map((action) => (
                        <motion.button
                          key={action.id}
                          onClick={() => handleActionClick(action.id)}
                          className={cn(
                            "w-full p-3 rounded-lg border transition-all duration-200",
                            "backdrop-blur-xl text-left group/action",
                            "hover:bg-white/[0.02]",
                            action.isExpanded ? 
                              action.status === 'loading' ? "border-amber-500/20 bg-amber-500/5" :
                              action.status === 'complete' ? "border-emerald-500/20 bg-emerald-500/5" :
                              "border-indigo-500/20 bg-indigo-500/5"
                            : "border-white/[0.04]"
                          )}
                          whileHover={{ scale: 1.002 }}
                          whileTap={{ scale: 0.998 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "mt-0.5 p-1.5 rounded-lg transition-colors",
                              action.status === 'loading' ? "bg-amber-500/10" :
                              action.status === 'complete' ? "bg-emerald-500/10" :
                              "bg-indigo-500/10"
                            )}>
                              {action.status === 'loading' ? (
                                <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
                              ) : action.status === 'complete' ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-sm",
                                  action.status === 'loading' ? "text-amber-100/90" :
                                  action.status === 'complete' ? "text-emerald-100/90" :
                                  "text-indigo-100/90",
                                  "group-hover/action:text-white"
                                )}>
                                  {action.text}
                                </span>
                                {action.command && (
                                  <code className={cn(
                                    "px-1.5 py-0.5 text-[10px] rounded",
                                    action.status === 'loading' ? "bg-amber-500/10 text-amber-300/60" :
                                    action.status === 'complete' ? "bg-emerald-500/10 text-emerald-300/60" :
                                    "bg-indigo-500/10 text-indigo-300/60"
                                  )}>
                                    {action.command}
                                  </code>
                                )}
                              </div>
                              {action.description && (
                                <p className={cn(
                                  "mt-0.5 text-xs",
                                  action.status === 'loading' ? "text-amber-200/40" :
                                  action.status === 'complete' ? "text-emerald-200/40" :
                                  "text-indigo-200/40"
                                )}>
                                  {action.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div ref={messagesEndRef} className="h-4" /> {/* Added bottom padding */}
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0C0C0D] via-[#0C0C0D] to-transparent">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--color-1))] via-[hsl(var(--color-3))] to-[hsl(var(--color-5))] rounded-xl blur-md opacity-30 group-hover:opacity-50 animate-rainbow transition-opacity" />
          <div className="relative">
            <div className="absolute left-4 top-4">
              <Sparkles className="h-5 w-5 text-white/30" />
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
                "bg-black/50 backdrop-blur-xl",
                "border border-white/10",
                "rounded-xl resize-none",
                "text-sm text-white/90",
                "placeholder:text-white/30",
                "focus:outline-none focus:ring-0 focus:border-white/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            />
            <div className="absolute right-4 bottom-4 flex items-center gap-2 text-white/30">
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04]">⌘</kbd>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04]">Enter</kbd>
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
      return;
    }

    if (activeThought < thoughts.length) {
      const timer = setTimeout(() => {
        setActiveThought(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeThought, thoughts, thoughts.length, isCompleting]);

  return (
    <div className="relative py-2">
      {/* Main vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-400/0 via-blue-400/10 to-blue-400/0">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400/30 via-blue-400/20 to-blue-400/10"
          initial={{ height: 0 }}
          animate={{ height: `${(Math.min(activeThought + 1, thoughts.length) / thoughts.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      <div className="space-y-5">
        {thoughts.map((thought, index) => (
          <motion.div
            key={thought.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ 
              opacity: index <= activeThought ? 1 : 0.3,
              y: index <= activeThought ? 0 : 8
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex items-center group"
          >
            {/* Horizontal connector */}
            <div className="absolute left-3 w-3 h-[1px] bg-gradient-to-r from-blue-400/20 to-transparent" />
            
            {/* Dot with pulse */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                index === activeThought ? "bg-blue-400" :
                index < activeThought ? "bg-blue-400/40" : 
                "bg-blue-400/20"
              )} />
              {index === activeThought && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400/30"
                  animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: index <= activeThought ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex-1 text-sm leading-relaxed pl-3",
                index === activeThought ? "text-blue-100/90" :
                index < activeThought ? "text-blue-100/70" :
                "text-blue-100/40"
              )}
            >
              <span className="font-light">{thought.content}</span>
              <div className="flex items-center gap-2 text-xs text-blue-400/40 mt-1">
                <div className="h-1 w-1 rounded-full bg-blue-400/40" />
                <span>{thought.thoughtType}</span>
              </div>
            </motion.div>

            {/* Completion indicator */}
            {index < activeThought && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -right-1 top-1/2 -translate-y-1/2 text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}