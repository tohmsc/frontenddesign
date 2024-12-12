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
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Logs</span>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter logs..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 h-7 bg-muted/5 text-xs"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearLogs}
            className="p-1.5 hover:bg-muted/10 rounded-md transition-colors text-muted-foreground hover:text-primary"
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-muted/10 rounded-md transition-colors text-muted-foreground hover:text-primary"
            title={isCollapsed ? "Expand logs" : "Collapse logs"}
          >
            {isCollapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Logs Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div 
            className="flex-1 p-3 overflow-auto font-mono"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-1 text-xs">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground py-4">
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
                    <div key={log.id} className="text-muted-foreground">
                      <span className="text-muted-foreground/50 mr-2">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={cn(
                        "font-medium",
                        log.type === 'info' && "text-primary",
                        log.type === 'success' && "text-green-500",
                        log.type === 'warn' && "text-yellow-500",
                        log.type === 'error' && "text-red-500"
                      )}>
                        [{log.type}]
                      </span>
                      {" "}
                      {log.message}
                    </div>
                  ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 