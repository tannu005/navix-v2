import { Inter, Syne, DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { cn } from "@/lib/utils";

// 1. Initialize Obsidian-style Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-bebas" 
});

export const metadata = {
  title: {
    default: "Navix — AI Career Coach",
    template: "%s | Navix",
  },
  description: "Advance your career with AI-powered resume building, interview prep, and industry insights.",
  keywords: ["AI career coach", "Groq AI", "resume builder", "interview prep"],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning className="dark">
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body 
          className={cn(
            "min-h-screen bg-[#050505] antialiased selection:bg-primary/30",
            inter.variable,
            syne.variable,
            dmSans.variable,
            bebasNeue.variable
          )}
        >
          {/* The Cursor Trail and "String" physics are now handled 
             within the Page components using GSAP for better performance 
             and to prevent hydration mismatches.
          */}

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            
            {/* Main content wrapper */}
            <main className="relative min-h-screen">
              {children}
            </main>

            <Toaster richColors position="bottom-right" />

            {/* Obsidian-Style Technical Footer */}
            <footer className="relative z-10 py-12 border-t border-white/5 bg-[#050505]">
              <div className="container mx-auto px-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 opacity-50 grayscale">
                  <div className="h-[1px] w-12 bg-white" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-syne">
                    System Protocol v2.0
                  </span>
                  <div className="h-[1px] w-12 bg-white" />
                </div>
                
                <p className="text-[11px] font-dm tracking-widest text-muted-foreground uppercase">
                  Built by{" "}
                  <span className="text-white font-semibold">
                    Tannu Yadav
                  </span>{" "}
                  · VIT-AP University · 2026
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
