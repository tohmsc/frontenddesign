"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Files, Globe, Code } from "lucide-react"

export function WorkspacePanel() {
  return (
    <Card className="h-full bg-gradient-to-b from-background to-background/80 border-border">
      <Tabs defaultValue="files" className="h-full flex flex-col">
        <div className="border-b border-border p-3">
          <TabsList className="bg-muted border border-border p-1 h-11">
            <TabsTrigger 
              value="files" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground transition-colors"
            >
              <Files className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger 
              value="browser" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground transition-colors"
            >
              <Globe className="h-4 w-4 mr-2" />
              Browser
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-muted-foreground transition-colors"
            >
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="files" className="flex-1 p-6 m-0 overflow-hidden">
          <div className="rounded-lg border border-border bg-muted/50 backdrop-blur-sm p-6 h-full overflow-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2 sticky top-0 bg-background/90 py-2 -mt-2 -mx-2 px-2">
              <Files className="h-5 w-5 text-primary" />
              Project Files
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>File explorer will appear here</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="browser" className="flex-1 p-6 m-0 overflow-hidden">
          <div className="rounded-lg border border-border bg-muted/50 backdrop-blur-sm p-6 h-full overflow-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2 sticky top-0 bg-background/90 py-2 -mt-2 -mx-2 px-2">
              <Globe className="h-5 w-5 text-primary" />
              Browser Preview
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Browser preview will appear here</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="flex-1 p-6 m-0 overflow-hidden">
          <div className="rounded-lg border border-border bg-muted/50 backdrop-blur-sm p-6 h-full overflow-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2 sticky top-0 bg-background/90 py-2 -mt-2 -mx-2 px-2">
              <Code className="h-5 w-5 text-primary" />
              Code Editor
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Code editor will appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
