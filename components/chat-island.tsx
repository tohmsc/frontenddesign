"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, ChevronRight, Loader2, SendHorizontal, Check, Code, Globe, Star, User2, Bot, HelpCircle } from "lucide-react"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { FloatingPanelRoot, FloatingPanelTrigger, FloatingPanelContent, FloatingPanelForm, FloatingPanelLabel, FloatingPanelTextarea, FloatingPanelFooter, FloatingPanelCloseButton, FloatingPanelSubmitButton } from "@/components/ui/floating-panel"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

type IconType = 'code' | 'globe' | 'check' | 'chart' | 'activity' | 'trending-up' | 'user' | 'tag' | 'sparkles'

interface Message {
  id: string
  role: 'assistant' | 'user' | 'system' | 'action' | 'input-request'
  content: string
  timestamp: string
  actions?: {
    id: string
    text: string
    status: 'loading' | 'complete' | 'error'
    description?: string
    subtasks?: {
      id: string
      text: string
      status: 'loading' | 'complete' | 'error'
      icon: IconType
    }[]
  }[]
  inputRequest?: {
    id: string
    question: string
    description?: string
    type: 'text' | 'confirm' | 'select'
    options?: string[]
  }
}

const messageVariants = {
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

export function ChatIslandDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Customer Success AI Agent initialized. Ready to help you succeed with our product.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        {
          id: '1',
          text: 'System Initialization',
          status: 'complete',
          description: 'Setting up Customer Success AI components',
          subtasks: [
            { id: '1', text: 'Product knowledge base loaded', status: 'complete', icon: 'code' },
            { id: '2', text: 'Success metrics initialized', status: 'complete', icon: 'globe' },
            { id: '3', text: 'Best practices engine ready', status: 'complete', icon: 'check' }
          ]
        }
      ]
    },
    {
      id: 'user-1',
      role: 'user',
      content: "Hi, I need help optimizing our team's usage of the analytics dashboard. We're not sure if we're getting the most value out of it.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'action-1',
      role: 'action',
      content: 'Analyzing usage patterns...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        {
          id: '2',
          text: 'Usage Analysis',
          status: 'complete',
          description: 'Evaluating current dashboard utilization',
          subtasks: [
            { id: '3', text: 'Feature adoption check', status: 'complete', icon: 'chart' },
            { id: '4', text: 'Usage patterns analysis', status: 'complete', icon: 'activity' },
            { id: '5', text: 'ROI calculation', status: 'complete', icon: 'trending-up' }
          ]
        }
      ]
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content: "I've analyzed your team's dashboard usage. I notice you're mainly using basic features, but there's potential for much more. Let's focus on your main goals first - what metrics are most important for your team?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputRequest: {
        id: '6',
        question: 'Select your primary metrics',
        description: 'Choose the metrics that matter most to your team',
        type: 'select',
        options: [
          'User Engagement',
          'Revenue Impact',
          'Customer Satisfaction',
          'Team Productivity'
        ]
      }
    }
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll handler with messages dependency
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      })
    }
  }, []) // No dependencies needed as it only uses ref

  // Scroll when messages change
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [scrollToBottom]) // Only depend on scrollToBottom since it's stable

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Simulate AI response with enhanced customer service actions
    setTimeout(() => {
      const actionMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'action',
        content: 'Processing customer request...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            id: '1',
            text: 'Customer Care Protocol',
            status: 'complete',
            description: 'Analyzing request and preparing personalized assistance',
            subtasks: [
              { id: '1', text: 'Customer profile analysis', status: 'complete', icon: 'user' },
              { id: '2', text: 'Issue categorization', status: 'complete', icon: 'tag' },
              { id: '3', text: 'Solution matching', status: 'complete', icon: 'check' },
              { id: '4', text: 'Response optimization', status: 'complete', icon: 'sparkles' }
            ]
          }
        ]
      }
      setMessages(prev => [...prev, actionMessage])

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "I'm here to help resolve your issue. Could you please provide more details about what you're experiencing?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          inputRequest: {
            id: '2',
            question: 'What can I help you with today?',
            description: 'Please describe your issue or question',
            type: 'text'
          }
        }
        setMessages(prev => [...prev, aiMessage])
        setIsThinking(false)
      }, 1000)
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area with improved responsiveness */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/30">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 sm:p-6"
            >
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">Analyzing your needs...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area with improved responsiveness */}
      <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-background via-background/80 to-transparent">
        <div className="glass-effect p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about features, best practices, or optimization..."
              aria-label="Message input"
              disabled={isThinking}
              className={cn(
                "flex-1 h-12 sm:h-14 bg-background/50 border-border/50",
                "text-sm sm:text-base text-foreground placeholder:text-muted-foreground",
                "focus:bg-background/80 transition-all",
                "focus:ring-2 focus:ring-primary/50 rounded-lg sm:rounded-xl",
                "shadow-sm disabled:opacity-50",
                "disabled:cursor-not-allowed"
              )}
            />
            <RainbowButton 
              type="submit" 
              size="icon"
              className={cn(
                "h-10 w-10 sm:h-11 sm:w-11",
                "bg-[linear-gradient(#121213,#121213),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                "dark:bg-[linear-gradient(#121213,#121213),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]"
              )}
              disabled={!input.trim() || isThinking}
              aria-label="Send message"
            >
              <SendHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </RainbowButton>
          </form>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsInputOpen(false)
    setInputValue("")
  }

  const getMessageIcon = () => {
    switch (message.role) {
      case 'assistant':
        return <Bot className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case 'user':
        return <User2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      case 'system':
        return <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      case 'action':
        return <Code className="h-5 w-5 text-green-500 dark:text-green-400" />
      default:
        return <HelpCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
    }
  }

  const getMessageLabel = () => {
    switch (message.role) {
      case 'assistant':
        return 'Success Coach AI'
      case 'user':
        return 'You'
      case 'system':
        return 'System'
      case 'action':
        return 'Analysis'
      default:
        return 'Input Required'
    }
  }

  return (
    <motion.div 
      className={cn(
        "relative px-3 sm:px-6 py-3 sm:py-4 transition-all backdrop-blur-sm",
        message.role === 'assistant' && 'bg-blue-50/30 dark:bg-blue-950/20', 
        message.role === 'user' && 'bg-gray-50/50 dark:bg-gray-900/30',
        message.role === 'system' && 'bg-purple-50/30 dark:bg-purple-950/20',
        message.role === 'action' && 'bg-green-50/30 dark:bg-green-950/20',
        message.role === 'input-request' && 'bg-yellow-50/30 dark:bg-yellow-900/20'
      )}
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {/* Message Header with responsive spacing */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className={cn(
            "p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-sm transition-all",
            message.role === 'assistant' && 'bg-blue-100/80 dark:bg-blue-900/80 hover:bg-blue-200/80 dark:hover:bg-blue-800/80',
            message.role === 'user' && 'bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80',
            message.role === 'system' && 'bg-purple-100/80 dark:bg-purple-900/80 hover:bg-purple-200/80 dark:hover:bg-purple-800/80',
            message.role === 'action' && 'bg-green-100/80 dark:bg-green-900/80 hover:bg-green-200/80 dark:hover:bg-green-800/80',
            message.role === 'input-request' && 'bg-yellow-100/80 dark:bg-yellow-900/80 hover:bg-yellow-200/80 dark:hover:bg-yellow-800/80'
          )}>
            {getMessageIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              {getMessageLabel()}
            </span>
            {message.timestamp && (
              <span className="text-xs font-medium text-muted-foreground/75">{message.timestamp}</span>
            )}
          </div>
        </div>
      </div>

      {/* Message Content with responsive padding */}
      <div className="space-y-3 sm:space-y-4 pl-[36px] sm:pl-[44px]">
        <div className="text-sm leading-relaxed text-foreground/90 font-medium break-words">
          {message.content}
        </div>

        {/* Actions List with improved spacing */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            {message.actions.map(action => (
              <div 
                key={action.id}
                className="rounded-lg sm:rounded-xl border border-border/50 bg-background/50 overflow-hidden transition-all hover:border-border/80"
              >
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/5">
                  {action.status === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-foreground/90 break-words">{action.text}</span>
                </div>
                {action.description && (
                  <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs text-muted-foreground/90 border-t border-border/50 bg-muted/5 break-words">
                    {action.description}
                  </div>
                )}
                {action.subtasks && action.subtasks.length > 0 && (
                  <div className="border-t border-border/50">
                    {action.subtasks.map(subtask => (
                      <div 
                        key={subtask.id}
                        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/5 border-b border-border/50 last:border-0 transition-all hover:bg-muted/10"
                      >
                        {subtask.status === 'loading' ? (
                          <Loader2 className="h-3 w-3 animate-spin text-blue-500/80 dark:text-blue-400/80 flex-shrink-0" />
                        ) : (
                          <Check className="h-3 w-3 text-green-500/80 dark:text-green-400/80 flex-shrink-0" />
                        )}
                        <span className="text-xs text-muted-foreground/90 font-medium break-words">{subtask.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input Request Panel with responsive design */}
        {message.inputRequest && (
          <div className="mt-4 sm:mt-6">
            {message.inputRequest.type === 'select' ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-foreground/90">
                    {message.inputRequest.question}
                  </span>
                  {message.inputRequest.description && (
                    <span className="text-xs text-muted-foreground/80">
                      {message.inputRequest.description}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.inputRequest.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setInputValue(option)
                        handleInputSubmit(new Event('submit') as unknown as React.FormEvent)
                      }}
                      className={cn(
                        "px-4 py-3 text-sm rounded-lg transition-all text-left",
                        "border border-border/50 hover:border-primary/50",
                        "bg-background/50 hover:bg-primary/5",
                        "flex items-center gap-2",
                        "group"
                      )}
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <FloatingPanelRoot>
                <FloatingPanelTrigger
                  title={message.inputRequest.question}
                  className={cn(
                    "w-full transition-all rounded-lg sm:rounded-xl p-3 sm:p-4",
                    "glass-panel hover:bg-muted/5",
                    "group flex items-center justify-between"
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl glass-effect bg-yellow-100/50 dark:bg-yellow-900/50 flex-shrink-0">
                      <HelpCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-foreground/90 break-words">
                        {message.inputRequest.question}
                      </span>
                      {message.inputRequest.description && (
                        <span className="text-xs text-muted-foreground/80 break-words">
                          {message.inputRequest.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground/90 flex-shrink-0 ml-2" />
                </FloatingPanelTrigger>
                <FloatingPanelContent className="w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px]">
                  <FloatingPanelForm onSubmit={handleInputSubmit}>
                    <FloatingPanelLabel htmlFor="user-input" className="text-sm font-medium break-words">
                      {message.inputRequest.description || message.inputRequest.question}
                    </FloatingPanelLabel>
                    <FloatingPanelTextarea
                      id="user-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="min-h-[120px] text-sm"
                    />
                    <FloatingPanelFooter>
                      <FloatingPanelCloseButton className="hover:bg-muted/10" />
                      <FloatingPanelSubmitButton 
                        text="Submit"
                        className="bg-primary/90 hover:bg-primary text-primary-foreground"
                      />
                    </FloatingPanelFooter>
                  </FloatingPanelForm>
                </FloatingPanelContent>
              </FloatingPanelRoot>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}