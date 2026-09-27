# Anvesha

> **Discover. Connect. Learn.**  
> 🌐 **Live Website:** [https://code-young-anvesha.vercel.app](https://code-young-anvesha.vercel.app)

Anvesha is an intuitive 1-on-1 trial class appointment booking platform designed to streamline scheduling between international parents (US/UK) and educators in India. Parents can select a specialized learning track (Scratch, Python, Web Dev, Math & Logic), choose a convenient time slot in their local timezone, get automatically paired with a certified mentor, receive instant calendar invites & live classroom links, and attend an interactive virtual demo session.

---

## 🚀 Quick Start

### Option A: 1-Click Launchers (Easiest)
```bash
git clone https://github.com/pajju011/CodeYoung_Anvesha.git
cd CodeYoung_Anvesha
```
- **Windows:** Double-click [`run.bat`](https://github.com/pajju011/CodeYoung_Anvesha/blob/main/run.bat) (or run `run.bat` in terminal)
- **macOS / Linux:** Run `./run.sh` in terminal

*(Verifies Node.js, auto-installs dependencies if missing, starts both Express & Vite, and opens your browser)*

---

### Option B: Terminal Commands (Cross-Platform)
```bash
git clone https://github.com/pajju011/CodeYoung_Anvesha.git
cd CodeYoung_Anvesha

# Install dependencies
npm install

# Start both Express backend and React frontend
npm run dev
```

---

### 🌐 Access Links
- **Live Production App:** [https://code-young-anvesha.vercel.app](https://code-young-anvesha.vercel.app)
- **Live Demo Classroom:** [https://code-young-anvesha.vercel.app/?view=classroom&id=demo_session](https://code-young-anvesha.vercel.app/?view=classroom&id=demo_session)
- **Local Frontend:** [http://localhost:5173](http://localhost:5173)
- **Local Backend API:** [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Local Classroom:** [http://localhost:5173/?view=classroom&id=demo_session](http://localhost:5173/?view=classroom&id=demo_session)

---

## ✨ Features

- **Cross-Timezone & DST:** Dual clock displays for parents (US/UK) and mentors (India) with automated Daylight Saving Time adjustment.
- **Mentor Capacity Management:** Auto-matching across 10 mentors, strictly capped at 2 sessions/day per mentor (20 sessions/day max).
- **Virtual Classroom:** Interactive trial room with mic/camera test, collaborative whiteboard, live code runner, and chat.
- **Privacy & Data Protection:** Strict session isolation preventing customer contact details from being exposed or pre-filled on shared devices.
- **Calendar & Notifications:** Instant Google Calendar sync, `.ics` iCal download, and simulated email dispatches.
- **Session Feedback:** Built-in post-class review and rating system.

---

## 🏗️ System Architecture

### Runtime Architecture & Trust Boundaries

```mermaid
graph TB
  %% Trust Boundaries
  subgraph Client_Boundary ["Trust Boundary: Client Browser (Untrusted Environment)"]
    direction TB
    C1["1. React 19 Frontend (App.jsx / Stepper)"]
    C2["2. Timezone Detector (Intl.DateTimeFormat)"]
    C3["3. Form & Privacy Guard (StepDetails.jsx)"]
    C4["4. Virtual Classroom (DemoClassroomModal.jsx)"]
    C5["5. Local Session Cache (storageUtils.js)"]
    C6["6. Calendar Exporter (calendarUtils.js)"]
  end

  subgraph Edge_Boundary ["Trust Boundary: Cloud Edge & Static Hosting"]
    E1["7. Vercel Edge / Static CDN (dist/ + vercel.json)"]
  end

  subgraph Server_Boundary ["Trust Boundary: Server Environment (Trusted Backend)"]
    direction TB
    S1["8. Express 5 API Router (server/index.js)"]
    S2["9. Scheduling Engine (schedulingService.js)"]
    S3["10. Capacity & Quota Guard (Max 2 Classes/Mentor/Day)"]
    S4["11. Email Dispatch Simulator (createBookingConfirmation)"]
    S5["12. In-Memory Persistence Store (bookingsStore & feedbackStore)"]
  end

  subgraph External_Boundary ["Trust Boundary: External Dependencies & Hardware"]
    EXT1["Browser Camera & Microphone (MediaDevices API)"]
    EXT2["Google Calendar & iCal Export"]
    EXT3["Google Fonts CDN (Plus Jakarta Sans)"]
  end

  %% Primary Path (Trial Class Booking Flow)
  User([Parent / Student]) ==>|1. Accesses App| C1
  C1 -.->|Auto-detects Local Timezone| C2
  C1 ==>|2. Fetch Available Slots GET /api/slots| S1
  S1 ==>|3. Calculate Working Hours & DST| S2
  S2 ==>|4. Verify Mentor Quotas| S3
  S3 -.->|Inspect Daily Count| S5
  S1 ==>|5. Return Available Slots| C1
  C1 ==>|6. Enters Contact Info| C3
  C3 ==>|7. Submit Booking POST /api/bookings| S1
  S1 ==>|8. Commit Reservation| S5
  S1 ==>|9. Dispatch Parent & Mentor Emails| S4
  S1 ==>|10. Return Confirmed Reference Code| C1
  C1 ==>|11a. Add to Calendar| C6 --> EXT2
  C1 ==>|11b. Launch Classroom Session| C4 --> EXT1

  %% Static & Auxiliary Flows
  E1 -.->|Delivers Static Assets| C1
  EXT3 -.->|Web Typography| C1
  C1 -.->|Isolated Session Cache| C5

  %% Styling
  classDef primary fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff;
  classDef backend fill:#059669,stroke:#047857,stroke-width:2px,color:#ffffff;
  classDef edge fill:#7c3aed,stroke:#6d28d9,stroke-width:2px,color:#ffffff;
  classDef external fill:#d97706,stroke:#b45309,stroke-width:2px,color:#ffffff;
  classDef userNode fill:#0f172a,stroke:#0f172a,stroke-width:2px,color:#ffffff;

  class C1,C3,C4 primary;
  class S1,S2,S3,S4,S5 backend;
  class E1 edge;
  class EXT1,EXT2,EXT3 external;
  class User userNode;
```

### Architecture Highlights
- **Primary Booking Path (`==>`):** User accesses React client $\rightarrow$ auto-detects timezone $\rightarrow$ fetches available slots via Express API $\rightarrow$ scheduling engine computes slots with DST & quota limits $\rightarrow$ user inputs contact details with privacy guard $\rightarrow$ backend confirms booking, stores state, dispatches simulated emails, and returns reference code $\rightarrow$ user syncs calendar or joins virtual classroom.
- **12 Core Components:** Organized across 4 explicit trust boundaries (Client Browser, Cloud Edge, Application Server, External Services/Hardware).
- **Data Privacy & Isolation:** Client inputs use `autoComplete="off"` with complete separation between sessions; public API queries never expose customer contact details.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Vanilla CSS, Lucide Icons
- **Backend:** Node.js, Express 5
- **Deployment:** [Vercel (code-young-anvesha.vercel.app)](https://code-young-anvesha.vercel.app)

---

## 📡 API Endpoints

- `GET /api/mentors` — List mentors and remaining daily quota
- `GET /api/slots` — Available slots by date and timezone
- `POST /api/bookings` — Confirm booking, assign mentor, and dispatch emails
- `DELETE /api/bookings/:id` — Cancel a booking
- `POST /api/feedback` — Submit session review and rating

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE).

---

## 👨‍💻 Author

Developed by **[Prajwal R Poojary](https://github.com/pajju011)**

