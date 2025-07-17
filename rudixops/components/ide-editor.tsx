"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IDEEditorProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

import { tabs } from "@/lib/markdownContent";

export function IDEEditor({ activeTab, setActiveTab }: IDEEditorProps) {

  const [code, setCode] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (currentTab) {
      setCode(currentTab.content);
      setViewMode(currentTab.type === "markdown" ? "preview" : "edit");
    }
  }, [activeTab]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    const tabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (tabIndex !== -1) {
      tabs[tabIndex].content = e.target.value;
    }
  };

  const updateScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("scroll", updateScroll);
      updateScroll();
      return () => {
        textareaRef.current?.removeEventListener("scroll", updateScroll);
      };
    }
  }, []);

  const currentTabType = tabs.find((tab) => tab.id === activeTab)?.type;
  const lines = code.split("\n");
  const lineCount = lines.length;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden shadow-lg bg-black/30 border-0-5-white-10">
      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-r border-white/10",
              activeTab === tab.id
                ? "text-white bg-black/30"
                : "text-gray-400 hover:bg-black/40",
            )}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Markdown Edit/Preview Toggle */}
      {currentTabType === "markdown" && (
        <div className="flex justify-end border-b border-white/10 bg-black/20 p-2">
          <div className="flex items-center border-0-5-white-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("edit")}
              className={cn(
                "text-xs rounded-none",
                viewMode === "edit" && "bg-accent text-accent-foreground",
              )}
            >
              Edit
            </Button>
            <div className="w-px h-4 bg-white/10"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("preview")}
              className={cn(
                "text-xs rounded-none",
                viewMode === "preview" && "bg-accent text-accent-foreground",
              )}
            >
              Preview
            </Button>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {viewMode === "edit" || currentTabType === "code" ? (
          <>
            <div
              ref={lineNumbersRef}
              className="flex-shrink-0 w-12 py-4 pl-3 pr-2 text-right text-sm font-mono text-gray-400 select-none overflow-hidden"
              style={{ lineHeight: "1.5rem" }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <Textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              className="flex-1 p-4 pb-16 text-sm font-mono bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none outline-none text-white"
              style={{ lineHeight: "1.5rem" }}
              spellCheck="false"
            />
          </>
        ) : (
          <div className="flex-1 p-4 pb-16 overflow-auto prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 w-full !max-w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{code}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
