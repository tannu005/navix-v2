import { Inter, Syne, DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { cn } from "@/lib/utils";

// Initialize Obsidian Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
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
  description: "Advance your career with AI-powered resume building and interview mastery.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning className="dark">
        <body
          className={cn(
            "min-h-screen bg-[#050505] antialiased selection:bg-primary/30",
            inter.variable,
            syne.variable,
            dmSans.variable,
            bebasNeue.variable
          )}
        >
          {/* Global Providers: 
            Theme is locked to 'dark' for the Obsidian aesthetic 
          */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Header />

            {/* Content Wrapper */}
            <main className="relative min-h-screen">
              {children}
            </main>

            <Toaster richColors position="bottom-right" />

            {/* Obsidian Technical Footer */}
            <footer className="relative z-10 py-16 border-t border-white/5 bg-[#050505]">
              <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                <div className="flex items-center gap-6 opacity-30">
                  <div className="h-[1px] w-16 bg-white" />
                  <span className="text-[9px] uppercase tracking-[0.5em] font-syne">
                    System Protocol v2.0 // Terminal
                  </span>
                  <div className="h-[1px] w-16 bg-white" />
                </div>
                
                <p className="text-[10px] font-dm tracking-widest text-muted-foreground uppercase">
                  Engineered by{" "}
                  <span className="text-white font-semibold">Tannu Yadav</span>{" "}
                  · VIT-AP · 2026
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
