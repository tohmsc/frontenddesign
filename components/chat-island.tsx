"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { Brain, ChevronRight, Loader2, Check, Code, Bot, HelpCircle, Terminal, Settings2, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Action {
  id: string
  text: string
  status: 'loading' | 'complete' | 'error' | 'ready'
  description?: string
  isExpanded?: boolean
  checked?: boolean
  command?: string
}

interface Message {
  id: string
  role: 'assistant' | 'user' | 'system' | 'action' | 'progress'
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
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.23, 1, 0.32, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

function ChatMessage({ message, onActionClick }: ChatMessageProps): React.ReactElement {
  const [actions, setActions] = React.useState<Action[]>(message.actions || [])

  const handleCompleteAction = React.useCallback((id: string) => {
    setActions(prevActions => 
      prevActions.map(action => 
        action.id === id ? { ...action, checked: !action.checked } : action
      )
    )
  }, [])

  const handleExpandAction = React.useCallback((id: string) => {
    setActions(prevActions =>
      prevActions.map(action =>
        action.id === id ? { ...action, isExpanded: !action.isExpanded } : action
      )
    )
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        message.role === 'assistant' && [
          'px-12 py-5',
          'bg-[#0A0A0A]',
          'border-b border-white/[0.03]',
          'mb-1'
        ],
        message.role === 'progress' && [
          'px-12 py-3',
          'bg-[#0A0A0A]',
          'border-b border-white/[0.03]',
          'mb-1'
        ].join(' '),
        message.role === 'action' && [
          'px-12 py-3 mx-8 my-3',
          'bg-[#0A0A0A]',
          'rounded-lg',
          'border border-white/[0.04]'
        ].join(' '),
        message.role === 'user' && [
          'px-12 py-5',
          'bg-[#141414]',
          'border-b border-white/[0.03]',
          'mb-1'
        ].join(' ')
      )}
    >
      {message.role === 'assistant' && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/30">
            <Bot className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">
              {message.content}
            </div>
          </div>
        </div>
      )}

      {message.role === 'progress' && (
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/30">
            <Settings2 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">
              {message.content}
            </div>
          </div>
        </div>
      )}

      {message.role === 'user' && (
        <div className="text-sm text-white/90">
          {message.content}
        </div>
      )}

      {message.actions && message.actions.length > 0 && (
        <div className="mt-4 space-y-6 px-16">
          {actions.map((action) => (
            <div key={action.id}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCompleteAction(action.id)}
                  className={cn(
                    "h-4 w-4 rounded border border-white/20",
                    "hover:border-white/40 transition-colors",
                    action.checked && "bg-emerald-500/20 border-emerald-500/50"
                  )}
                >
                  {action.checked && <Check className="h-3 w-3 text-emerald-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => onActionClick?.(action.id)}
                  className="text-base font-medium text-white/90 flex-1 text-left hover:text-white transition-colors"
                >
                  {action.text}
                </button>
                <button
                  type="button"
                  onClick={() => handleExpandAction(action.id)}
                  className={cn(
                    "p-1 rounded-full",
                    "hover:bg-white/5 transition-colors"
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-white/30",
                      "transition-transform duration-200",
                      action.isExpanded && "rotate-90"
                    )}
                  />
                </button>
              </div>

              {action.isExpanded && (
                <div className="px-9 pb-3 space-y-2">
                  {action.description && (
                    <div className="text-sm text-white/50 pt-2">
                      {action.description}
                    </div>
                  )}
                  {action.command && (
                    <div className="flex items-center gap-2 rounded bg-black px-3 py-2 font-mono text-xs text-white/70">
                      <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                      {action.command}
                    </div>
                  )}
                </div>
              )}
            </div>
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
      content: 'Analyzing request and preparing agent configuration...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    updateMessages(progressMessage)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'll help set that up. Here are the steps we need to take:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            id: Date.now().toString(),
            text: 'Initialize Project',
            status: 'loading',
            description: 'Setting up project structure and dependencies',
            command: 'bolt init agent-project',
            isExpanded: false,
            checked: false
          },
          {
            id: (Date.now() + 1).toString(),
            text: 'Configure Settings',
            status: 'ready',
            description: 'Define agent behavior and capabilities',
            command: 'bolt config set',
            isExpanded: false,
            checked: false
          },
          {
            id: (Date.now() + 2).toString(),
            text: 'Deploy Agent',
            status: 'ready',
            description: 'Deploy agent to development environment',
            command: 'bolt deploy --env dev',
            isExpanded: false,
            checked: false
          }
        ]
      }
      updateMessages(aiMessage)
      setIsThinking(false)
    }, 1000)
  }, [input, isThinking, updateMessages])

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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="pt-24 pb-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onActionClick={handleActionClick}
              />
            ))}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'px-12 py-5',
                  'bg-[#141414]',
                  'border-b border-white/[0.03]'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/20">
                    <Settings2 className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="text-sm font-medium text-white/90">
                    Thinking about how to help...
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-6">
        <div className="px-6">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-white/30" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What kind of agent would you like to build?"
                aria-label="Message input"
                disabled={isThinking}
                className={cn(
                  "group relative w-full min-h-[84px] animate-rainbow cursor-pointer bg-[length:200%] font-medium transition-colors",
                  "[background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  "rounded-xl px-12 py-3 resize-none",
                  "text-sm text-white/90 placeholder:text-white/30",
                  
                  // Rainbow gradient backgrounds
                  "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                  "dark:bg-[linear-gradient(#0C0C0C,#0C0C0C),linear-gradient(#0C0C0C_50%,rgba(12,12,12,0.6)_80%,rgba(12,12,12,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                )}
              />
              <div className="absolute right-3 top-3">
                <HelpCircle className="h-5 w-5 text-white/30" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}