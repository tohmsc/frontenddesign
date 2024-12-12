import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Terminal, Check, Brain, Loader2, Code, Globe, SendHorizontal, Sparkles } from "lucide-react"

export function AIChat() {
  return (
    <div className="w-[400px]">
      <Card className="h-screen">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Agent Chat
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col h-[calc(100%-56px)]">
          <ScrollArea className="flex-1 pb-4">
            <div className="flex flex-col divide-y">
              {/* User Command */}
              <div className="p-4 hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Terminal className="h-4 w-4" />
                    <span className="font-medium">User Command</span>
                  </div>
                  <span className="text-xs text-muted-foreground">12:34 PM</span>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg font-mono text-sm">
                  create a new react app
                </div>
              </div>

              {/* AI Response */}
              <div className="p-4 bg-muted/5 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-medium">AI Response</span>
                  </div>
                  <span className="text-xs text-muted-foreground">12:35 PM</span>
                </div>

                <div className="space-y-4">
                  {/* Primary Task Group */}
                  <Collapsible defaultOpen className="space-y-2">
                    <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-md transition-colors">
                      <ChevronRight className="h-5 w-5 shrink-0 transition-transform duration-300 text-muted-foreground ease-in-out [&[data-state=open]]:rotate-90" />
                      <div className="group relative flex items-center gap-2 py-3 px-4 flex-1 rounded-md overflow-hidden transition-all duration-300">
                        {/* Gradient backgrounds */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/25 via-purple-500/25 to-fuchsia-500/25 opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 animate-[pulse_3s_ease-in-out_infinite]" />
                        
                        {/* Content */}
                        <div className="relative flex items-center gap-3 z-10">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-500 shrink-0" />
                          <span className="font-semibold text-base bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                            Creating React Application
                          </span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1.5 ml-6">
                      <div className="flex items-center gap-2 text-muted-foreground py-1.5 px-2 hover:bg-accent/10 rounded-md transition-colors">
                        <Code className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>Initializing project structure</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground py-1.5 px-2 hover:bg-accent/10 rounded-md transition-colors">
                        <Globe className="h-4 w-4 text-purple-500 shrink-0" />
                        <span>Installing dependencies</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground py-1.5 px-2 hover:bg-accent/10 rounded-md transition-colors">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Setting up development server</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Secondary Task Group */}
                  <Collapsible defaultOpen className="space-y-1.5">
                    <CollapsibleTrigger className="flex items-center gap-2 w-full hover:bg-accent/10 rounded-md transition-colors">
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-300 text-muted-foreground ease-in-out [&[data-state=open]]:rotate-90" />
                      <div className="flex items-center gap-2 py-1.5 px-2 flex-1">
                        <Sparkles className="h-4 w-4 text-yellow-500 shrink-0" />
                        <span className="font-medium">Project Setup Complete</span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1.5 ml-6">
                      <div className="flex items-center gap-2 text-muted-foreground py-1.5 px-2 hover:bg-accent/10 rounded-md transition-colors">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Project structure created</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground py-1.5 px-2 hover:bg-accent/10 rounded-md transition-colors">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Dependencies installed successfully</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground py-1.5 px-2 hover:bg-accent/10 rounded-md transition-colors">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Development server configured</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t bg-card shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
            <div className="px-4 py-3 flex gap-3">
              <Textarea 
                className="resize-none min-h-[72px] focus-visible:ring-primary" 
                placeholder="Enter a command..."
                rows={3}
              />
              <div className="flex-shrink-0 flex items-center">
                <RainbowButton className="h-[72px] !px-6">
                  <SendHorizontal className="h-5 w-5" />
                </RainbowButton>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
