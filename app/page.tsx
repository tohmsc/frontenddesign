import { ChatIslandDemo } from '@/components/chat-island';
import { ToolsPanel } from '@/components/tools-panel';
import { LogsPanel } from '@/components/logs-panel';

export default function Home() {
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#111111] opacity-90" />
      
      {/* Main content */}
      <div className="relative h-full grid grid-cols-[minmax(320px,35%)_1fr]">
        {/* Chat panel */}
        <div className="h-full overflow-hidden border-r border-white/[0.02] bg-black">
          <ChatIslandDemo />
        </div>
        
        {/* Right side: Tools and Logs */}
        <div className="h-full flex flex-col overflow-hidden bg-[#111111]">
          {/* Tools panel */}
          <div className="flex-1 min-h-0 p-6">
            <ToolsPanel />
          </div>

          {/* Logs panel - Commented out */}
          {/* <div className="h-40 shrink-0 border-t border-white/[0.02] p-6">
            <LogsPanel />
          </div> */}
        </div>
      </div>
    </div>
  );
}
