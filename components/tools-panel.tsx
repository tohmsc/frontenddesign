"use client";

import { useState, useCallback } from "react";
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Code,
  FolderTree,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Folder,
  File,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";

interface RecentPage {
  title: string;
  url: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  component: () => ReactElement;
}

interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileSystemItem[];
}

const recentPages: RecentPage[] = [
  { title: "Documentation", url: "docs.example.com" },
  { title: "Dashboard", url: "app.example.com" },
];

const fileSystem: FileSystemItem[] = [
  {
    id: "root",
    name: "Project Root",
    type: "folder",
    children: [
      {
        id: "src",
        name: "src",
        type: "folder",
        children: [
          { id: "index", name: "index.ts", type: "file" },
          { id: "types", name: "types.ts", type: "file" },
        ],
      },
      { id: "package", name: "package.json", type: "file" },
      { id: "readme", name: "README.md", type: "file" },
    ],
  },
];

function BrowserPanel() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
          <button
            type="button"
            className="p-1.5 hover:bg-white/[0.08] rounded-md transition-colors disabled:opacity-50"
            disabled
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4 text-white/40" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white/[0.08] rounded-md transition-colors disabled:opacity-50"
            disabled
            aria-label="Go forward"
          >
            <ChevronRight className="h-4 w-4 text-white/40" />
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1.5 hover:bg-white/[0.08] rounded-md transition-colors"
            aria-label="Refresh page"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 text-white/40 transition-all",
                isLoading && "animate-spin"
              )}
            />
          </button>
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-4 w-4 text-zinc-400" />
          </div>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="pl-9 h-8 bg-white border-0 focus-visible:ring-1 focus-visible:ring-zinc-200 text-zinc-900 placeholder:text-zinc-400"
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 rounded-lg border border-white/[0.04] bg-white/[0.02] overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-3 max-w-md mx-auto px-6">
            <Globe className="h-12 w-12 text-white/20 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-white/80 mb-1">
                Welcome to Browser Preview
              </h3>
              <p className="text-sm text-white/40">
                Enter a URL above to start browsing or choose from your recent
                pages below.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {recentPages.map((page) => (
                <button
                  key={page.url}
                  type="button"
                  onClick={() => setUrl(page.url)}
                  className="p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors text-left group"
                >
                  <div className="text-sm font-medium text-white/80 mb-1 group-hover:text-white">
                    {page.title}
                  </div>
                  <div className="text-xs text-white/40">{page.url}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodePanel() {
  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <RainbowButton size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5 mr-2" />
          New File
        </RainbowButton>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in files..."
            className="pl-8 h-8 bg-muted/10 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 w-full"
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 rounded-lg border border-border/50 bg-muted/5 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-3 max-w-md mx-auto px-6">
            <Code className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground/80 mb-1">
                Code Editor
              </h3>
              <p className="text-sm text-muted-foreground">
                Create a new file or select an existing one to start coding.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                className="p-4 rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors text-left group"
              >
                <div className="text-sm font-medium text-foreground/80 mb-1 group-hover:text-primary">
                  New File
                </div>
                <div className="text-xs text-muted-foreground">
                  Create a blank file
                </div>
              </button>
              <button
                type="button"
                className="p-4 rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors text-left group"
              >
                <div className="text-sm font-medium text-foreground/80 mb-1 group-hover:text-primary">
                  Open File
                </div>
                <div className="text-xs text-muted-foreground">
                  Browse existing files
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileSystemPanel() {
  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <RainbowButton size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5 mr-2" />
          New Folder
        </RainbowButton>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-8 h-8 bg-muted/10 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 w-full"
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 rounded-lg border border-border/50 bg-muted/5 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 p-2 hover:bg-muted/10 rounded-lg cursor-pointer group">
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
              <Folder className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-foreground/80 group-hover:text-primary">
                Project Root
              </span>
            </div>
            <div className="ml-4 space-y-0.5 pl-2 border-l border-border/50">
              <div className="flex items-center gap-2 p-2 hover:bg-muted/10 rounded-lg cursor-pointer group">
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                <Folder className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80 group-hover:text-primary">
                  src
                </span>
              </div>
              <div className="ml-4 space-y-0.5 pl-2 border-l border-border/50">
                <div className="flex items-center gap-2 p-2 hover:bg-muted/10 rounded-lg cursor-pointer group">
                  <File className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground/80 group-hover:text-primary">
                    index.ts
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-muted/10 rounded-lg cursor-pointer group">
                  <File className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground/80 group-hover:text-primary">
                    types.ts
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-muted/10 rounded-lg cursor-pointer group">
                <File className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground/80 group-hover:text-primary">
                  package.json
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-muted/10 rounded-lg cursor-pointer group">
                <File className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground/80 group-hover:text-primary">
                  README.md
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const tabs: Tab[] = [
  {
    id: "browser",
    label: "Browser",
    icon: Globe,
    component: BrowserPanel,
  },
  {
    id: "code",
    label: "Code",
    icon: Code,
    component: CodePanel,
  },
  {
    id: "filesystem",
    label: "File System",
    icon: FolderTree,
    component: FileSystemPanel,
  },
];

export function ToolsPanel() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || tabs[0].component;

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="border-b border-white/[0.04]">
        <nav className="flex items-center w-full px-6" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2.5 px-4 py-2.5 transition-all flex-1",
                  "hover:text-white/90 focus-visible:outline-none",
                  isActive ? "text-white/90" : "text-white/40"
                )}
              >
                <div className="flex items-center gap-2 mx-auto">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-white/90" : "text-white/40"
                    )}
                  />
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute left-0 right-0 -bottom-px h-[2px] bg-white/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 flex flex-col min-h-0 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col min-h-0 p-3"
          >
            <div
              className="flex-1 flex flex-col min-h-0"
              role="tabpanel"
              id={`${activeTab}-panel`}
              aria-labelledby={activeTab}
            >
              <ActiveComponent />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
