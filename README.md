# Anvesha

A 1-on-1 trial class appointment booking platform connecting parents and mentors across global timezones.

---

## 🚀 Quick Start

### 1-Click Launch
- **Windows:** Double-click `run.bat` (or run `run.bat` in terminal)
- **macOS / Linux:** Run `./run.sh`

### Manual Run
```bash
npm install
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Demo Classroom:** [http://localhost:5173/?view=classroom&id=demo_session](http://localhost:5173/?view=classroom&id=demo_session)

---

## ✨ Features

- **Cross-Timezone & DST:** Dual clock displays for parents (US/UK) and mentors (India) with automated Daylight Saving Time adjustment.
- **Mentor Capacity Management:** Auto-matching across 10 mentors, strictly capped at 2 sessions/day per mentor (20 sessions/day max).
- **Virtual Classroom:** Interactive trial room with mic/camera test, collaborative whiteboard, live code runner, and chat.
- **Privacy & Data Protection:** Strict session isolation preventing customer contact details from being exposed or pre-filled on shared devices.
- **Calendar & Notifications:** Instant Google Calendar sync, `.ics` iCal download, and simulated email dispatches.
- **Session Feedback:** Built-in post-class review and rating system.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Vanilla CSS, Lucide Icons
- **Backend:** Node.js, Express 5
- **Deployment:** Vercel

---

## 📡 API Endpoints

- `GET /api/mentors` — List mentors and remaining daily quota
- `GET /api/slots` — Available slots by date and timezone
- `POST /api/bookings` — Confirm booking, assign mentor, and dispatch emails
- `DELETE /api/bookings/:id` — Cancel a booking
- `POST /api/feedback` — Submit session review and rating

---

## 👨‍💻 Author

Developed by **[Prajwal R Poojary](https://github.com/pajju011)**
