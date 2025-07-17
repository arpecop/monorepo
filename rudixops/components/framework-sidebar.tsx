"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrameworkSidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  setCurrentView: (view: string) => void;
}

export function FrameworkSidebar({
  isOpen,
  activeTab,
  setActiveTab,
  setCurrentView,
}: FrameworkSidebarProps) {
  // Only show markdown files
  const markdownFiles = [
    {
      id: "welcome",
      name: "Welcome.md",
      type: "markdown",
    },
    {
      id: "services",
      name: "Services.md",
      type: "markdown",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute left-12 top-0 bottom-0 w-1/2 sidebar-solid z-10 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-sm font-semibold text-white">Framework Explorer</h2>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 p-4">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Markdown Files
          </h3>
          {markdownFiles.map((file) => (
            <button
              key={file.id}
              onClick={() => {
                setActiveTab(file.id);
                setCurrentView("editor");
              }}
              className={cn(
                "flex items-center gap-2 w-full p-2 text-left text-sm rounded hover:bg-white/10 transition-colors",
                activeTab === file.id
                  ? "bg-white/20 text-white"
                  : "text-gray-300",
              )}
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
