// This component is no longer used in app/page.tsx as per user request.
// Keeping it here for reference if the user decides to re-introduce a sidebar later.
"use client"

import type * as React from "react"
import { Mail, Github, Linkedin, Twitter } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activePanel: string | null
}

export function AppSidebar({ activePanel, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="sidebar" className="frosted-glass" {...props}>
      <SidebarContent>
        {activePanel === "contact" && (
          <SidebarGroup>
            <SidebarGroupLabel>Contact</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="mailto:contact@example.com" target="_blank" rel="noopener noreferrer">
                      <Mail />
                      <span>Email</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                      <Github />
                      <span>GitHub</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                      <Linkedin />
                      <span>LinkedIn</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                      <Twitter />
                      <span>Twitter</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
