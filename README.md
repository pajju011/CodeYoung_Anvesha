# Anvesha — 1-on-1 Trial Class Booking Platform

> **Discover. Connect. Learn.**  
> An intuitive, cross-timezone appointment scheduling web app connecting parents and mentors for live 1-on-1 trial classes.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- **🌐 Cross-Timezone Scheduling & DST Support:** Seamlessly coordinates slots between parents (US, UK, etc.) and educators in India (IST). Displays dual-timezone clock indicators with automatic Daylight Saving Time adjustment.
- **👩‍🏫 Smart Mentor Assignment & Capacity Limits:** Balances booking distribution across 10 specialized educators, strictly enforcing a hard cap of 2 demo classes per mentor per day (20 sessions/day capacity).
- **🖥️ Interactive Virtual Classroom:** Built-in trial room with webcam/mic self-checks, collaborative whiteboard, live Python code runner, and curriculum agenda.
- **🔒 Customer Privacy & Data Protection:** Strict session isolation preventing personal contact details from being exposed or pre-filled on shared devices, with 1-click browser history purge.
- **📅 Instant Calendar Sync:** One-click Google Calendar integration and `.ics` download for Apple Calendar and Outlook.
- **⭐ Post-Session Feedback System:** Interactive feedback modal capturing ratings, session pace, and comments immediately upon leaving or completing a session.
- **📱 Responsive Design:** Polished, touch-friendly UI optimized across mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Vanilla CSS Design System, Lucide React Icons
- **Backend:** Node.js, Express 5, CORS
- **Storage:** In-memory backend persistent store with client-side session fallback
- **Deployment:** Vercel (`vercel.json`), Render (`render.yaml`), Railway (`Procfile`)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/pajju011/CodeYoung_Anvesha.git
cd CodeYoung_Anvesha
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
This runs both the Express backend API (`http://localhost:3001`) and the Vite React frontend (`http://localhost:5173`) concurrently.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and capacity metrics |
| `GET` | `/api/mentors` | 10 certified mentors and remaining daily quota |
| `GET` | `/api/slots` | Available slots calculated in parent's timezone |
| `POST` | `/api/bookings` | Confirm booking, assign mentor, and dispatch emails |
| `GET` | `/api/bookings` | Bookings list (customer PII sanitized) |
| `DELETE` | `/api/bookings/:id` | Cancel a booking |
| `POST` | `/api/feedback` | Submit session review and rating |

---

## 🚢 Deployment

### Vercel (Frontend & Serverless API)
1. Import repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

### Render / Railway (Full-Stack Container)
- **Render:** Connect GitHub repo; detected automatically via `render.yaml`.
- **Railway / Heroku:** Reads `Procfile` (`web: npm start`).
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

---

## 👨‍💻 Author

Developed by **[Prajwal R Poojary](https://github.com/pajju011)**
