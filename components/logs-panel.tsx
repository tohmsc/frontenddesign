"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, XCircle, ChevronDown, ChevronUp, Search, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface Log {
  id: string
  type: 'info' | 'success' | 'warn' | 'error'
  message: string
  timestamp: string
}

const initialLogs: Log[] = [
  { id: '1', type: 'info', message: 'System initialized', timestamp: new Date().toISOString() },
  { id: '2', type: 'info', message: 'Loading components...', timestamp: new Date().toISOString() },
  { id: '3', type: 'success', message: 'All components loaded', timestamp: new Date().toISOString() },
  { id: '4', type: 'warn', message: 'Cache expired', timestamp: new Date().toISOString() },
  { id: '5', type: 'info', message: 'Rebuilding cache...', timestamp: new Date().toISOString() }
]

export function LogsPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [filter, setFilter] = useState("")
  const [logs, setLogs] = useState<Log[]>(initialLogs)

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-black border border-white/[0.04] rounded-lg overflow-hidden">
      <div className="h-full overflow-auto font-mono scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        <div className="p-2 pb-6 space-y-1 text-[10px] leading-relaxed">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center min-h-[4rem] text-white/30">
              No logs to display
            </div>
          ) : (
            logs
              .filter(log => 
                !filter || 
                log.message.toLowerCase().includes(filter.toLowerCase()) ||
                log.type.toLowerCase().includes(filter.toLowerCase())
              )
              .map((log) => (
                <div key={log.id} className="px-1 py-0.5 text-white/90 transition-opacity hover:opacity-100 rounded hover:bg-white/[0.02]">
                  <span className="text-white/30 mr-2 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={cn(
                    "font-medium",
                    log.type === 'info' && "text-blue-400/90",
                    log.type === 'success' && "text-emerald-400/90",
                    log.type === 'warn' && "text-amber-400/90",
                    log.type === 'error' && "text-rose-400/90"
                  )}>
                    [{log.type}]
                  </span>
                  {" "}
                  <span className="text-white/70">{log.message}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
} 