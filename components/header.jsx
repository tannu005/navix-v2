import React from "react";
import { Button } from "./ui/button";
import {
  PenBox, LayoutDashboard, FileText, GraduationCap,
  ChevronDown, Briefcase, Brain, Map, BarChart2, DollarSign, Zap
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkuser";

export default async function Header() {
  await checkUser();

  return (
    <header className="fixed top-0 w-full z-50" style={{ borderBottom: "1px solid hsl(199 89% 60% / 0.1)" }}>
      <div
        className="absolute inset-0"
        style={{
          background: "hsl(222, 20%, 6% / 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      />
      <nav className="relative container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo text fallback — shows "NAVIX" with cyan accent if no logo.png */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 font-bold text-xl tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Zap className="h-5 w-5" style={{ color: "hsl(199, 89%, 60%)" }} />
            <span className="text-foreground">Navi</span>
            <span style={{ color: "hsl(199, 89%, 60%)" }}>x</span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden md:inline-flex items-center gap-2 text-sm"
                style={{ color: "hsl(215, 15%, 65%)" }}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-2 text-sm font-medium btn-glow"
                  style={{ background: "hsl(199, 89%, 48%)", color: "#fff", border: "none" }}
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden md:block">AI Tools</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60"
                style={{ background: "hsl(222, 18%, 9%)", border: "1px solid hsl(199 89% 60% / 0.15)" }}
              >
                <DropdownMenuLabel className="text-xs uppercase tracking-widest" style={{ color: "hsl(199, 89%, 60%)" }}>
                  Agentic AI
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/ai-agent" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" style={{ color: "hsl(199, 89%, 60%)" }} /> AI Career Agent
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/career-roadmap" className="flex items-center gap-2">
                    <Map className="h-4 w-4" style={{ color: "hsl(199, 89%, 60%)" }} /> Career Roadmap
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/skill-gap" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" style={{ color: "hsl(199, 89%, 60%)" }} /> Skill Gap Analyser
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/salary" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" style={{ color: "hsl(199, 89%, 60%)" }} /> Salary Intelligence
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ background: "hsl(199 89% 60% / 0.1)" }} />
                <DropdownMenuLabel className="text-xs uppercase tracking-widest" style={{ color: "hsl(215, 15%, 50%)" }}>
                  Career Tools
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-cover-letter" className="flex items-center gap-2">
                    <PenBox className="h-4 w-4" /> Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ background: "hsl(199 89% 60% / 0.1)" }} />
                <DropdownMenuItem asChild>
                  <Link href="/job-tracker" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Job Tracker
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                className="text-sm"
                style={{ borderColor: "hsl(199 89% 60% / 0.3)", color: "hsl(199, 89%, 70%)" }}
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
