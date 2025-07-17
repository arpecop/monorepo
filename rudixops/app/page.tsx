"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { IDEEditor } from "@/components/ide-editor";
import { AboutSection } from "@/components/about-section";
import ReusableModal from "@/components/reusable-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Info, FileText, Mail } from "lucide-react";
import { BottomBar } from "@/components/bottom-bar";

import { FrameworkSidebar } from "@/components/framework-sidebar";

export default function HomePage() {
  const [currentView, setCurrentView] = useState("editor"); // 'editor' or 'about'
  const [activeEditorTab, setActiveEditorTab] = useState("welcome"); // 'welcome', 'services', 'code'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility
  const [isContactOpen, setIsContactOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col p-4">
      <ReusableModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title="Contact Us"
        description="Let's build the future together. Reach out for a consultation."
        footer={<Button onClick={() => setIsContactOpen(false)} className="bg-blue-600 hover:bg-blue-700">Send Message</Button>}
      >
        <div className="grid gap-4 py-4">
          <Input placeholder="Name" className="bg-zinc-800 border-zinc-700" />
          <Input placeholder="Email" className="bg-zinc-800 border-zinc-700" />
          <Textarea placeholder="Your message" className="bg-zinc-800 border-zinc-700" />
        </div>
      </ReusableModal>

      <div className="flex flex-col flex-1 rounded-xl frosted-glass overflow-hidden">
        <div className="flex items-center h-10 px-4 bg-black/20">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center text-sm font-medium text-gray-300">
            rudixops.dev
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden relative">
          <div className="flex flex-col items-center justify-between w-12 py-4 bg-black/20 z-20">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isSidebarOpen && "bg-accent text-accent-foreground",
                )}
                onClick={toggleSidebar}
                title="Framework Explorer"
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">Framework Explorer</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8")}
                onClick={() => setIsContactOpen(true)}
                title="Contact Us"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Contact Us</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8")}
                onClick={() => {
                  setCurrentView("about");
                }}
                title="About"
              >
                <Info className="h-5 w-5" />
                <span className="sr-only">About</span>
              </Button>
            </div>
          </div>

          {/* Framework Sidebar - overlays half width */}
          <FrameworkSidebar
            isOpen={isSidebarOpen}
            activeTab={activeEditorTab}
            setActiveTab={setActiveEditorTab}
            setCurrentView={setCurrentView}
          />

          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {currentView === "editor" ? (
                <IDEEditor
                  activeTab={activeEditorTab}
                  setActiveTab={setActiveEditorTab}
                />
              ) : (
                <AboutSection />
              )}
            </div>
            <BottomBar />
          </div>
        </div>
      </div>
    </div>
  );
}