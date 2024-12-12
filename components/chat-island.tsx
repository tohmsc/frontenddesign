"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { Brain, ChevronRight, Loader2, Check, Code, Bot, HelpCircle, Terminal, Settings2, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { create } from 'zustand'
import { FamilyButton } from "@/components/ui/family-button"
import { RainbowButton } from "@/components/ui/rainbow-button"

function WindowsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
    </svg>
  )
}

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

interface Message {
  id: string
  role: 'user' | 'assistant' | 'progress'
  content: string
  timestamp: string
  actions?: Action[]
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

function ChatMessage({ message, onActionClick }: ChatMessageProps): React.ReactElement {
  const [actions, setActions] = React.useState<Action[]>(message.actions || [])

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
          </div>
        </div>
      )}

      {message.role === 'progress' && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/30 border border-white/[0.05]">
            <Settings2 className="h-5 w-5 text-cyan-400 animate-pulse" />
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

      {message.actions && message.actions.length > 0 && (
        <div className="mt-4 space-y-2 pl-[52px]">
          {actions.map((action) => (
            <motion.div 
              key={action.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border border-white/[0.08] bg-black/40",
                "backdrop-blur-xl",
                "overflow-hidden",
                "transition-all duration-200",
                action.isExpanded && "ring-1 ring-white/[0.08]"
              )}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <RainbowButton
                    onClick={() => onActionClick?.(action.id)}
                    className="text-sm font-medium"
                  >
                    {action.text}
                  </RainbowButton>
                </div>
              </div>

              {action.isExpanded && action.command && (
                <div className="border-t border-white/[0.04] bg-black/60">
                  <div className="flex flex-col gap-1 p-3">
                    <div className="font-mono text-xs text-white/60">
                      <span className="text-cyan-400/90">{action.command}</span>
                    </div>
                    {action.status === 'complete' && (
                      <div className="font-mono text-xs text-emerald-400/90">
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
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export function ChatIslandDemo(): React.ReactElement {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "I'm your AI agent, ready to help build and improve your project. I'll explain what I'm doing as we go along.",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: '1',
          text: 'Create Code Assistant',
          status: 'ready',
          description: 'Build an AI agent that helps with coding tasks',
          command: 'npm create agent@latest',
          isExpanded: false,
          checked: false
        },
        {
          id: '2',
          text: 'Create Data Analyzer',
          status: 'ready',
          description: 'Build an AI agent for data analysis and visualization',
          command: 'npm create agent@latest',
          isExpanded: false,
          checked: false
        },
        {
          id: '3',
          text: 'Create Custom Agent',
          status: 'ready',
          description: 'Build a custom AI agent from scratch',
          command: 'npm create agent@latest',
          isExpanded: false,
          checked: false
        }
      ]
    },
    {
      id: 'user-1',
      role: 'user',
      content: "I'd like to create a code assistant that can help with code reviews and suggestions.",
      timestamp: new Date().toISOString()
    },
    {
      id: 'progress-1',
      role: 'progress',
      content: 'Setting up your code assistant agent...',
      timestamp: new Date().toISOString()
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content: "Great choice! I'll help you set up a code assistant. Here's what we'll do:",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'setup-1',
          text: 'Initialize Project',
          status: 'complete',
          description: 'Setting up the project structure',
          command: 'npm init',
          isExpanded: true,
          checked: true
        },
        {
          id: 'setup-2',
          text: 'Configure Code Analysis',
          status: 'loading',
          description: 'Setting up code parsing and analysis capabilities',
          command: 'npm install @babel/parser',
          isExpanded: true,
          checked: false
        },
        {
          id: 'setup-3',
          text: 'Setup Language Models',
          status: 'ready',
          description: 'Configure AI models for code understanding',
          command: 'npm install @transformers/code',
          isExpanded: false,
          checked: false
        }
      ]
    },
    {
      id: 'user-2',
      role: 'user',
      content: "What kind of code analysis capabilities will it have?",
      timestamp: new Date().toISOString()
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      content: "The code assistant will have these analysis capabilities:",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'analysis-1',
          text: 'Static Analysis',
          status: 'complete',
          description: 'Detect code patterns and potential issues',
          isExpanded: true,
          checked: true
        },
        {
          id: 'analysis-2',
          text: 'Style Checking',
          status: 'complete',
          description: 'Ensure code follows style guidelines',
          isExpanded: true,
          checked: true
        },
        {
          id: 'analysis-3',
          text: 'Security Scanning',
          status: 'loading',
          description: 'Identify security vulnerabilities',
          isExpanded: true,
          checked: false
        }
      ]
    }
  ])
  const [isThinking, setIsThinking] = React.useState(false)
  const [input, setInput] = React.useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const setStatus = useStatusStore((state) => state.setStatus)

  const scrollToBottom = React.useCallback(() => {
    if (!messagesEndRef.current) return
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const updateMessages = React.useCallback((newMessage: Message) => {
    setMessages(prev => [...prev, newMessage])
    scrollToBottom()
  }, [scrollToBottom])

  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    // Update status
    setStatus('Processing your request...')
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    updateMessages(userMessage)
    setInput('')
    setIsThinking(true)

    // Show progress message
    const progressMessage: Message = {
      id: Date.now().toString(),
      role: 'progress',
      content: 'Analyzing request and preparing response...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    updateMessages(progressMessage)

    // Simulate AI response
    setTimeout(() => {
      setStatus('Generating response...')
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'll help with that. Here's what we'll do:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            id: Date.now().toString(),
            text: 'Analyze Request',
            status: 'loading',
            description: 'Processing your input',
            command: 'analyze',
            isExpanded: false,
            checked: false
          }
        ]
      }
      updateMessages(aiMessage)
      setIsThinking(false)
      setStatus('Ready')
    }, 1000)
  }, [input, isThinking, setStatus, updateMessages])

  const handleActionClick = (actionId: string) => {
    setIsThinking(true)
    
    const progressMessage: Message = {
      id: Date.now().toString(),
      role: 'progress',
      content: 'Processing your request...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    updateMessages(progressMessage)

    setTimeout(() => {
      const responses: Record<string, Message> = {
        '1': {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Let's set up your code assistant. First, we'll configure the core features:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            {
              id: 'code-1',
              text: 'Code Parsing',
              status: 'loading',
              description: 'Setting up language parsers',
              isExpanded: true,
              checked: false
            },
            {
              id: 'code-2',
              text: 'Analysis Rules',
              status: 'ready',
              description: 'Configure analysis patterns',
              isExpanded: false,
              checked: false
            }
          ]
        },
        '2': {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Let's configure your data analyzer with these capabilities:",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            {
              id: 'data-1',
              text: 'Data Import',
              status: 'loading',
              description: 'Configure data source connections',
              isExpanded: true,
              checked: false
            },
            {
              id: 'data-2',
              text: 'Analysis Pipeline',
              status: 'ready',
              description: 'Set up data processing steps',
              isExpanded: false,
              checked: false
            }
          ]
        },
        '3': {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Let's create your custom agent. What capabilities would you like to add?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            {
              id: 'custom-1',
              text: 'Core Features',
              status: 'ready',
              description: 'Choose base capabilities',
              isExpanded: true,
              checked: false
            },
            {
              id: 'custom-2',
              text: 'Extensions',
              status: 'ready',
              description: 'Add specialized features',
              isExpanded: false,
              checked: false
            }
          ]
        }
      }

      const selectedResponse = responses[actionId]
      if (selectedResponse) {
        updateMessages(selectedResponse)
      }
      setIsThinking(false)
    }, 800)
  }

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
      }
    }
  }, [handleSubmit, input])

  return (
    <div className="relative h-full flex flex-col bg-[#0C0C0D]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 px-6 py-4 backdrop-blur-xl bg-black/40 border-b border-white/[0.04]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 blur-lg" />
              <div className="relative p-2 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.06]">
                <WindowsIcon className="h-5 w-5 text-white/80" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-medium tracking-tight text-white/90">New Software</h1>
              <p className="text-xs text-white/40">Building project</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-4 px-4 py-6"
      >
        <AnimatePresence mode="wait">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="group relative"
            >
              {/* Message bubble */}
              <div className={cn(
                "relative w-full rounded-xl p-4",
                message.role === 'user' ? "bg-white/[0.02] backdrop-blur-xl" : 
                message.role === 'progress' ? "bg-white/[0.02] backdrop-blur-xl" :
                "bg-white/[0.02] backdrop-blur-xl"
              )}>
                {/* Update indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "p-1 rounded-lg",
                    message.role === 'user' ? "bg-white/[0.04]" : 
                    message.role === 'progress' ? "bg-white/[0.04]" : 
                    "bg-white/[0.04]"
                  )}>
                    {message.role === 'user' ? (
                      <Sparkles className="h-3.5 w-3.5 text-white/60" />
                    ) : message.role === 'progress' ? (
                      <Loader2 className="h-3.5 w-3.5 text-white/60 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-white/60" />
                    )}
                  </div>
                  <span className="text-xs text-white/40">
                    {message.role === 'user' ? 'Request' : 
                     message.role === 'progress' ? 'Processing' : 
                     'Update'}
                  </span>
                  <span className="text-[10px] text-white/30">{message.timestamp}</span>
                </div>

                {/* Message content */}
                <div className={cn(
                  "text-sm leading-relaxed",
                  message.role === 'user' ? "text-white/90" : "text-white/80"
                )}>
                  {message.content}
                </div>

                {/* Actions */}
                {message.actions && (
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
                          action.isExpanded ? "border-white/[0.08] bg-white/[0.02]" : "border-white/[0.04]"
                        )}
                        whileHover={{ scale: 1.002 }}
                        whileTap={{ scale: 0.998 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5 p-1.5 rounded-lg transition-colors",
                            action.status === 'loading' ? "bg-white/[0.04]" : 
                            action.status === 'complete' ? "bg-white/[0.04]" :
                            "bg-white/[0.04]"
                          )}>
                            {action.status === 'loading' ? (
                              <Loader2 className="h-4 w-4 text-white/60 animate-spin" />
                            ) : action.status === 'complete' ? (
                              <Check className="h-4 w-4 text-white/60" />
                            ) : (
                              <Sparkles className="h-4 w-4 text-white/60" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white/90 group-hover/action:text-white">
                                {action.text}
                              </span>
                              {action.command && (
                                <code className="px-1.5 py-0.5 text-[10px] rounded bg-white/[0.04] text-white/40">
                                  {action.command}
                                </code>
                              )}
                            </div>
                            {action.description && (
                              <p className="mt-0.5 text-xs text-white/40">
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
        <div ref={messagesEndRef} />
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