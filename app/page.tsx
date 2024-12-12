import { ChatIslandDemo } from '@/components/chat-island';
import { ToolsPanel } from '@/components/tools-panel';
import { LogsPanel } from '@/components/logs-panel';

export default function Home() {
  return (
    <div className="relative h-screen bg-gradient-to-br from-background to-muted overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-3xl" />
      <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      
      {/* Main content */}
      <div className="relative h-full grid grid-cols-[400px_1fr]">
        {/* Chat panel */}
        <div className="h-full overflow-hidden border-r border-border/50 bg-background/50 backdrop-blur-xl">
          <ChatIslandDemo />
        </div>
        
        {/* Right side: Tools and Logs */}
        <div className="h-full flex flex-col overflow-hidden">
          {/* Tools panel */}
          <div className="flex-1 min-h-0 bg-background/50 backdrop-blur-xl">
            <ToolsPanel />
          </div>

          {/* Logs panel */}
          <div className="h-48 shrink-0 border-t border-border/50">
            <LogsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
