# Anvesha

> **Discover. Connect. Learn.**

Anvesha is an intuitive 1-on-1 trial class appointment booking platform designed to streamline scheduling between international parents (US/UK) and educators in India. Parents can select a specialized learning track (Scratch, Python, Web Dev, Math & Logic), choose a convenient time slot in their local timezone, get automatically paired with a certified mentor, receive instant calendar invites & live classroom links, and attend an interactive virtual demo session.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pajju011/CodeYoung_Anvesha.git
cd CodeYoung_Anvesha
```

### 2. Run the Application

#### Option A: 1-Click Launchers (Recommended)
- **Windows:** Double-click [`run.bat`](./run.bat) or run in Command Prompt / PowerShell:
  ```cmd
  run.bat
  ```
  *(Verifies Node.js, auto-installs dependencies if missing, starts both Express & Vite, and opens your browser)*

- **macOS / Linux:** Run [`run.sh`](./run.sh) in terminal:
  ```bash
  chmod +x run.sh
  ./run.sh
  ```

#### Option B: Standard Terminal Commands (Cross-Platform)
```bash
# Install dependencies
npm install

# Start both Express backend and React frontend
npm run dev
```

---

### 🌐 Access Links
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001/api/health](http://localhost:3001/api/health)
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
