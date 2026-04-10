// layout.js
import { Inter, Syne, DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { cn } from "@/lib/utils";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font injects CSS variables; Tailwind reads them via tailwind.config.js
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const bebasNeue = Bebas_Neue({
  weight: "400",       // Bebas Neue only ships weight 400
  subsets: ["latin"],
  variable: "--font-bebas",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
// IMPORTANT: metadata export only works in Server Components (no "use client")
export const metadata = {
  title: {
    default: "Navix — AI Career Coach",
    template: "%s | Navix",
  },
  description:
    "Advance your career with AI-powered resume building, interview prep, and industry insights.",
  keywords: ["AI career coach", "Groq AI", "resume builder", "interview prep"],
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      {/*
        suppressHydrationWarning: ThemeProvider toggles the `dark` class on
        <html> client-side, causing an expected hydration mismatch — suppress it.
      */}
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body
          className={cn(
            "min-h-screen bg-[#050505] antialiased selection:bg-[#c7593c]/30",
            inter.variable,
            syne.variable,
            dmSans.variable,
            bebasNeue.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // FIX: removed enableSystem — it overrides defaultTheme:"dark" on
            // light-mode OS, fighting the forced dark aesthetic of this app
            disableTransitionOnChange
          >
            <Header />

            {/*
              FIX: z-auto instead of z-0 — z-0 creates a stacking context that
              can trap fixed/sticky children (e.g. modals, dropdowns) below
              global overlays like the grain pseudo-element on body::after
            */}
            <main className="relative z-auto min-h-screen">
              {children}
            </main>

            <Toaster richColors position="bottom-right" />

            <footer className="relative z-10 py-12 border-t border-white/5 bg-[#050505]">
              <div className="container mx-auto px-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 opacity-30 grayscale">
                  <div className="h-[1px] w-12 bg-white" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-syne">
                    System Protocol v2.0
                  </span>
                  <div className="h-[1px] w-12 bg-white" />
                </div>

                <p className="text-[10px] font-dm tracking-[0.2em] text-muted-foreground uppercase">
                  Built by{" "}
                  <span className="text-white font-semibold">Tannu Yadav</span>
                  {" "}· VIT-AP University · 2026
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
