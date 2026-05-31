import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import CursorTrail from "@/components/CursorTrail";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Navix — AI Career Coach | Resume Builder & Interview Prep",
  description:
    "Navix — AI-powered career coaching platform for resume building, ATS optimization, interview prep, and job application tracking. Groq-powered insights.",
  keywords:
    "AI career coach, resume builder, ATS optimization, interview prep, job tracker, Groq AI",
  metadataBase: new URL("https://navix-v2.vercel.app"),
  openGraph: {
    title: "Navix — AI Career Coach",
    description:
      "AI-powered career coaching platform for resume building, ATS optimization, interview prep, and job application tracking.",
    url: "https://navix-v2.vercel.app",
    siteName: "Navix",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Navix — AI Career Coach",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Navix — AI Career Coach",
    description:
      "AI-powered career coaching platform for resume building, ATS optimization, interview prep, and job application tracking.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} bg-black text-white antialiased`}>
          <CursorTrail />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

