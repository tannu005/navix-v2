import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const dmSans = DM_Sans({ subsets: ["latin"], axes: ["opsz"] });

export const metadata = {
  title: {
    default: "Navix — AI Career Coach",
    template: "%s | Navix",
  },
  description:
    "Advance your career with AI-powered resume building, interview prep, cover letters, and industry insights.",
  keywords: ["AI career coach", "resume builder", "interview prep", "job tracker", "cover letter"],
  openGraph: {
    title: "Navix — AI Career Coach",
    description: "Your AI-powered career growth platform.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={dmSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer style={{ borderTop: "1px solid hsl(222, 15%, 12%)", background: "hsl(222, 20%, 5%)" }} className="py-10">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Built by{" "}
                  <span className="font-semibold" style={{ color: "hsl(199, 89%, 60%)" }}>
                    Tannu Yadav
                  </span>
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
