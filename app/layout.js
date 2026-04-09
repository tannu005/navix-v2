import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

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
const cursorScript = `
(function() {
  const core  = document.getElementById('cursor-core');
  const ring  = document.getElementById('cursor-ring');
  const canvas = document.getElementById('cursor-trail');
  if (!core || !ring || !canvas) return;

  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: -200, y: -200 };
  const rPos  = { x: -200, y: -200 };
  const TRAIL = 16;
  const trail = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button')) document.body.classList.add('cursor-hover');
    else if (e.target.closest('[data-card]')) document.body.classList.add('cursor-card');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button')) document.body.classList.remove('cursor-hover');
    else if (e.target.closest('[data-card]')) document.body.classList.remove('cursor-card');
  });

  function tick() {
    const ease = document.body.classList.contains('cursor-card') ? 0.07
               : document.body.classList.contains('cursor-hover') ? 0.14 : 0.10;
    rPos.x += (mouse.x - rPos.x) * ease;
    rPos.y += (mouse.y - rPos.y) * ease;

    core.style.left = mouse.x + 'px'; core.style.top = mouse.y + 'px';
    ring.style.left = rPos.x  + 'px'; ring.style.top = rPos.y  + 'px';

    trail.unshift({ x: rPos.x, y: rPos.y });
    trail.length = TRAIL;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (trail.length > 2) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      for (let i = 0; i < trail.length - 1; i++) {
        const mx = (trail[i].x + trail[i+1].x) / 2;
        const my = (trail[i].y + trail[i+1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, mx, my);
      }
      const g = ctx.createLinearGradient(mouse.x, mouse.y, trail[TRAIL-1].x, trail[TRAIL-1].y);
      g.addColorStop(0, 'rgba(0,200,255,0.5)');
      g.addColorStop(1, 'rgba(0,200,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    requestAnimationFrame(tick);
  }
  tick();

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
`;

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={inter.className}>
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
