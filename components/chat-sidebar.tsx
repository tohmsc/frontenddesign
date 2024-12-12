import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Bot, Code, Zap, Shield, ChevronRight, Terminal, Brain, Loader2, Check } from "lucide-react";

type MessageType = {
  id: string;
  type: 'agent' | 'user' | 'action' | 'capabilities';
  content: string;
  timestamp: Date;
  options?: Array<{
    letter: string;
    title: string;
    description: string;
  }>;
  capabilities?: Array<{
    title: string;
    description: string;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export function ChatSidebar() {
  const [messages] = useState<MessageType[]>([
    {
      id: '1',
      type: 'agent',
      content: "The code assistant will have these analysis capabilities:",
      timestamp: new Date(),
      options: [
        {
          letter: 'A',
          title: 'Code Review',
          description: 'Analyze code quality and patterns'
        },
        {
          letter: 'B',
          title: 'Performance',
          description: 'Optimize code execution speed'
        },
        {
          letter: 'C',
          title: 'Security',
          description: 'Find potential vulnerabilities'
        }
      ],
      capabilities: [
        {
          title: 'Static Analysis',
          description: 'Detect code patterns and potential issues'
        },
        {
          title: 'Style Checking',
          description: 'Ensure code follows style guidelines'
        },
        {
          title: 'Security Scanning',
          description: 'Identify security vulnerabilities'
        }
      ]
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Agent Introduction */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-5 border-b border-white/[0.04] bg-black/40 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            <Bot className="h-5 w-5 text-white/80" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white/90 tracking-tight">AI Assistant</h2>
            <p className="text-xs text-white/50">Code Analysis Expert</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Content */}
      <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Message Content */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-2xl p-4 border border-white/[0.08] backdrop-blur-xl mx-2"
              >
                <div className="flex items-start gap-3">
                  <Brain className="h-4 w-4 text-white/60 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <p className="text-sm text-white/90 leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </motion.div>

              {/* Options */}
              {message.options && (
                <motion.div 
                  variants={itemVariants}
                  className="space-y-3 px-2"
                >
                  <div className="text-sm font-medium text-white/80 px-2">Which aspect would you like to focus on?</div>
                  <div className="space-y-2">
                    {message.options.map((option) => (
                      <motion.button
                        key={option.letter}
                        className={cn(
                          "w-full p-3 rounded-xl border border-white/[0.08]",
                          "bg-gradient-to-b from-white/[0.08] to-white/[0.02]",
                          "backdrop-blur-xl text-left",
                          "hover:from-white/[0.12] hover:to-white/[0.04]",
                          "active:from-white/[0.08] active:to-white/[0.02]",
                          "transition-all duration-200 ease-out",
                          "group relative"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white/40">{option.letter}.</span>
                            <span className="text-sm font-medium text-white/90">{option.title}</span>
                          </div>
                          <div className="mt-1 text-xs text-white/50 pl-5">{option.description}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Capabilities */}
              {message.capabilities && (
                <motion.div 
                  variants={itemVariants}
                  className="space-y-3 px-2 pt-2"
                >
                  <div className="text-sm font-medium text-white/80 px-2">Analysis Capabilities</div>
                  <div className="space-y-3">
                    {message.capabilities.map((capability) => (
                      <motion.div 
                        key={capability.title}
                        className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-xl"
                        variants={itemVariants}
                      >
                        <div className="p-1 rounded-lg bg-white/[0.04]">
                          <Check className="h-3.5 w-3.5 text-white/60" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white/80">{capability.title}</div>
                          <div className="text-xs text-white/50 mt-0.5">{capability.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Box with Rainbow Effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-4 border-t border-white/[0.04] bg-black/40 backdrop-blur-xl"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--color-1))] via-[hsl(var(--color-3))] to-[hsl(var(--color-5))] rounded-lg blur-md opacity-30 group-hover:opacity-50 animate-rainbow transition-opacity" />
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-black/50 text-white/90 text-sm rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:ring-0 focus:border-white/20 placeholder-white/40 backdrop-blur-xl"
            />
            <button 
              type="button"
              className="absolute right-3 p-1.5 rounded-lg bg-gradient-to-r from-[hsl(var(--color-1))] to-[hsl(var(--color-3))] text-white/90 hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-4 border-t border-white/[0.04] bg-black/40 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
          <span className="text-xs text-white/50">Ready to assist • Select an option above</span>
        </div>
      </motion.div>
    </div>
  );
}