"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  LayoutDashboard, FileText, GraduationCap, PenBox,
  ChevronDown, Briefcase, Brain, Map, BarChart2, DollarSign
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${
        scrolled 
          ? "bg-black/30 backdrop-blur-xl border-white/10 shadow-lg py-4" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <nav className="container mx-auto px-6 md:px-10 h-full flex items-center justify-between">
        
        {/* Sleek Logo Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-cyan-500/50 shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all duration-500 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Navix Logo" 
              fill
              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
            />
          </div>
          <div className="flex items-baseline">
            <span 
              className="text-2xl tracking-tighter font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-purple-500 transition-all duration-500"
            >
              NAVIX
            </span>
            <span className="text-cyan-400 font-bold text-3xl leading-none ml-[1px] animate-pulse">.</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <div className="flex gap-1 md:gap-2">
              <Button
                variant="ghost"
                asChild
                className="hidden md:inline-flex items-center gap-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-full px-4 transition-colors"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" className="md:hidden w-10 h-10 p-0 rounded-full text-white/60 hover:text-white hover:bg-white/5">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-full px-4 transition-colors"
                >
                  Tools
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 p-1.5 rounded-2xl shadow-2xl border border-white/10 bg-black/80 backdrop-blur-2xl"
              >
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest px-2 py-1.5 text-white/40 font-medium">
                  Intelligence
                </DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/ai-agent" className="flex items-center gap-3 text-white/80">
                    <Brain className="h-4 w-4 text-white/50" /> Career Agent
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/career-roadmap" className="flex items-center gap-3 text-white/80">
                    <Map className="h-4 w-4 text-white/50" /> Roadmap
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/skill-gap" className="flex items-center gap-3 text-white/80">
                    <BarChart2 className="h-4 w-4 text-white/50" /> Skill Gap
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/salary" className="flex items-center gap-3 text-white/80">
                    <DollarSign className="h-4 w-4 text-white/50" /> Salary Intel
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-1.5 bg-white/5" />
                
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest px-2 py-1.5 text-white/40 font-medium">
                  Preparation
                </DropdownMenuLabel>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/resume" className="flex items-center gap-3 text-white/70">
                    <FileText className="h-4 w-4 text-white/40" /> Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/ai-cover-letter" className="flex items-center gap-3 text-white/70">
                    <PenBox className="h-4 w-4 text-white/40" /> Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/interview" className="flex items-center gap-3 text-white/70">
                    <GraduationCap className="h-4 w-4 text-white/40" /> Interviews
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-1.5 bg-white/5" />
                
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-colors">
                  <Link href="/job-tracker" className="flex items-center gap-3 text-white/70">
                    <Briefcase className="h-4 w-4 text-white/40" /> Applications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button
                className="text-sm rounded-full px-5 h-9 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/5"
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="pl-4 border-l border-white/10 ml-1">
              <UserButton 
                appearance={{ 
                  elements: { 
                    avatarBox: "w-8 h-8 opacity-90 hover:opacity-100 transition-opacity" 
                  } 
                }} 
                afterSignOutUrl="/" 
              />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
