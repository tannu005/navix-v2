# Navix v2 — Agentic AI Career Coach

> Built on [piyush-eon/ai-career-coach](https://github.com/piyush-eon/ai-career-coach) with a complete agentic AI redesign

---

## What Makes This Different

### Agentic AI Architecture (ReAct Loop)
The core of Navix v2 is a **multi-step autonomous agent** that:
1. **Plans** — breaks your career goal into research steps
2. **Acts** — calls specialised tools (resume analysis, market research, skill gap evaluation)
3. **Observes** — reads tool results and updates its understanding
4. **Reflects** — synthesises all findings into a comprehensive, actionable answer

This is a real implementation of the **ReAct (Reasoning + Acting)** pattern used in production agentic systems — exactly what top companies hire for.

### Recruiter-Relevant Skills Demonstrated
| Skill | Where |
|-------|-------|
| Agentic AI / LLM orchestration | `lib/agent.js` |
| Tool-calling / function-calling | `lib/agent.js` → `AGENT_TOOLS` |
| Multi-step reasoning chains | ReAct loop in `runAgent()` |
| Streaming UI updates | `agent-client.jsx` |
| Server Actions + Next.js App Router | All `actions/*.js` |
| Prisma ORM + PostgreSQL | Schema + DB layer |
| Clerk authentication | Middleware + checkUser |
| Background jobs (Inngest) | `lib/inngest/functions.js` |
| Tailwind CSS + shadcn/ui | All UI components |
| Recharts data visualisation | Dashboard, Interview |

---

## New Features vs Tutorial

| Feature | Tutorial | Navix v2 |
|---------|----------|----------|
| AI Career Agent | ❌ | ✅ Full ReAct loop with 8 tools |
| Career Roadmap | ❌ | ✅ Week-by-week AI plan |
| Skill Gap Analyser | ❌ | ✅ Match score + priorities |
| Salary Intelligence | ❌ | ✅ Ranges + negotiation script |
| ATS Score Checker | ❌ | ✅ In resume builder |
| Job Tracker | ❌ | ✅ Full pipeline tracking |
| Gemini model | 1.5-flash | 2.0-flash |
| AI setup | Duplicated in every file | Centralised `lib/gemini.js` |
| Industry refresh | Never refreshed | Auto-refreshes when stale |
| SEO metadata | Empty | Full OpenGraph + keywords |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/onboarding` | Profile setup |
| `/dashboard` | Industry insights + salary charts |
| `/ai-agent` | **NEW** Autonomous AI career agent |
| `/career-roadmap` | **NEW** AI-generated learning plan |
| `/skill-gap` | **NEW** Role match score + gap analysis |
| `/salary` | **NEW** Salary data + negotiation coach |
| `/resume` | Resume builder + ATS checker |
| `/ai-cover-letter` | Cover letter generator |
| `/interview` | Quiz + progress tracking |
| `/job-tracker` | Application pipeline |

---

## Setup

### 1. Clone tutorial repo and replace files
```bash
git clone https://github.com/piyush-eon/ai-career-coach.git navix
cd navix
# Replace all files with files from this folder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Fill in all values
```

### 4. Set up database
```bash
npx prisma db push
```

### 5. Run dev server
```bash
npm run dev
```

---

## Environment Variables

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | [neon.tech](https://neon.tech) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [clerk.com](https://clerk.com) |
| `CLERK_SECRET_KEY` | Clerk dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/onboarding` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/onboarding` |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| `INNGEST_EVENT_KEY` | [inngest.com](https://inngest.com) |
| `INNGEST_SIGNING_KEY` | Inngest dashboard |

---

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all env vars in Vercel project settings
4. Deploy — takes ~2 minutes
5. Add your Vercel domain to Clerk's allowed domains

---

## Tech Stack

- **Next.js 15** App Router + Server Actions
- **React 19**
- **Clerk** — Authentication
- **Prisma** + **Neon PostgreSQL** — Database
- **Google Gemini 2.0 Flash** — AI
- **Inngest** — Background jobs
- **shadcn/ui** + **Tailwind CSS** — UI
- **Recharts** — Charts
- **Inngest** — Cron jobs for weekly insight refresh

---

*Made by Tannu Yadav*
