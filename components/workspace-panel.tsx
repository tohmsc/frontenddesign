"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Files, Globe, Code, Hexagon, Box, Package, Database, Workflow, Command, Brain, Loader2, Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { DynamicContainer, DynamicDescription, DynamicIsland, DynamicIslandProvider, DynamicTitle, useScheduledAnimations, useDynamicIslandSize } from "@/components/ui/dynamic-island"
import { useStatusStore } from "@/components/chat-island"

interface StatusState {
  status: string
  setStatus: (status: string) => void
}

export function WorkspacePanel() {
  const [activeTab, setActiveTab] = useState("files")
  const status = useStatusStore((state: StatusState) => state.status)
  const { setSize } = useDynamicIslandSize()

  // Update Dynamic Island size based on status changes
  useEffect(() => {
    if (status === 'Ready') {
      setSize('compact')
    } else {
      setSize('long')
    }
  }, [status, setSize])

  return (
    <Card className="h-full overflow-hidden border-0 bg-black/20">
      <DynamicIslandProvider initialSize="compact">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] z-50">
          <DynamicIsland id="status-island">
            <DynamicContainer className="flex items-center justify-center h-full w-full">
              <div className="relative w-full flex items-center">
                <DynamicDescription className="absolute left-4 my-auto text-sm font-medium text-white/80">
                  {status === 'Ready' ? (
                    <Brain className="h-4 w-4 text-indigo-400" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                  )}
                </DynamicDescription>
                <DynamicDescription className="absolute right-4 my-auto text-sm font-medium text-white/80">
                  {status}
                </DynamicDescription>
              </div>
            </DynamicContainer>
          </DynamicIsland>
        </div>

        <Tabs defaultValue="files" className="h-full" onValueChange={setActiveTab}>
          <div className="flex h-full flex-col">
            <div className="border-b border-white/[0.04] bg-black/40 px-4 backdrop-blur-xl">
              <TabsList className="h-12 p-0 bg-transparent">
                <TabsTrigger 
                  value="files" 
                  className={cn(
                    "h-12 px-4 relative data-[state=active]:bg-transparent",
                    "data-[state=active]:text-white/90 data-[state=active]:shadow-none",
                    "transition-colors"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Files className="h-4 w-4" />
                    <span className="text-xs font-medium">Files</span>
                  </div>
                  {activeTab === "files" && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="dependencies" 
                  className={cn(
                    "h-12 px-4 relative data-[state=active]:bg-transparent",
                    "data-[state=active]:text-white/90 data-[state=active]:shadow-none",
                    "transition-colors"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Box className="h-4 w-4" />
                    <span className="text-xs font-medium">Dependencies</span>
                  </div>
                  {activeTab === "dependencies" && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="files" className="flex-1 p-4 outline-none data-[state=active]:mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-white/40" />
                    <h3 className="text-sm font-medium text-white/90">Project Structure</h3>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <Command className="h-3.5 w-3.5" />
                    <span className="text-[10px]">⌘K to search</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] group transition-colors cursor-pointer"
                  >
                    <Workflow className="h-3.5 w-3.5 text-white/40 group-hover:text-white/90" />
                    <span className="text-xs text-white/70 group-hover:text-white/90">src/</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] group transition-colors cursor-pointer"
                  >
                    <Code className="h-3.5 w-3.5 text-white/40 group-hover:text-white/90" />
                    <span className="text-xs text-white/70 group-hover:text-white/90">components/</span>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dependencies" className="flex-1 p-4 outline-none data-[state=active]:mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-white/40" />
                    <h3 className="text-sm font-medium text-white/90">Package Dependencies</h3>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-[10px]">npm install</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] group transition-colors cursor-pointer"
                  >
                    <Hexagon className="h-3.5 w-3.5 text-white/40 group-hover:text-white/90" />
                    <span className="text-xs text-white/70 group-hover:text-white/90">next: ^14.0.0</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] group transition-colors cursor-pointer"
                  >
                    <Hexagon className="h-3.5 w-3.5 text-white/40 group-hover:text-white/90" />
                    <span className="text-xs text-white/70 group-hover:text-white/90">react: ^18.0.0</span>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DynamicIslandProvider>
    </Card>
  )
}
