"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, User } from "lucide-react";
import { cats } from "@/app/_lib/cats";

import * as React from "react";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="  top-0 z-50   border-b dark:border-gray-800">
      <div className="container mx-auto px-4">
        {/* Top Bar */}

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 bg-amber-200">
            <div className="bg-slate-900   px-3 py-2 rounded font-bold text-xl relative">
              <span className="text-white absolute top-2 left-3 text-3xlfont-playfair">
                re
              </span>
              <span className="text-transparent">re</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground text-right">&nbsp;</p>
              <h1 className="text-3xl font-bold text-foreground -mt-2 -ml-1.5">
                newz
              </h1>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {cats.slice(0, 5).map((item, i) => (
              <Link
                key={i}
                href={"/category/" + item}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {item.split(" ")[0]}
              </Link>
            ))}
          </nav>
          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <Input
                    type="search"
                    placeholder="Search news..."
                    className="w-64"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-white px-4"
                title="Menu"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  {cats.map((item, i) => (
                    <Link
                      key={i}
                      href={"/category/" + item}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground py-2"
                    >
                      {item}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      asChild
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
