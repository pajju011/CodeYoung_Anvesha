# TrialClass — 1-on-1 Trial Class Scheduling Platform

A clean, production-grade appointment scheduling product designed specifically for educational technology platforms. Built to demonstrate thoughtful product design, accessible typography, accurate cross-timezone coordination, and realistic mentor matching.

---

## 🎯 Design Principles & Quality Standards

This application strictly avoids common "AI-generated / vibe-coded" design patterns and adheres to real-world product design standards:

| Principle | How It's Implemented |
|---|---|
| **No Purple Gradients** | Built with a disciplined, restrained color system using deep royal blue (`#1E40AF`), slate neutrals (`#0F172A`, `#334155`), and accessible borders (`#E2E8F0`). |
| **No Pill Buttons Everywhere** | Real interactive application buttons with intentional, moderate border radius (6px - 8px) and distinct primary, secondary, and ghost hierarchies. |
| **No Fake Reviews or Metrics** | Absolutely zero invented testimonials, zero star ratings, zero fake student/parent counters, and zero marketing puffery. |
| **Concise, Human Copy** | Direct and clear product communication ("Book a Free Trial Class", "Choose a convenient time for your child and we'll match you with an available mentor"). |
| **Consistent UI Icons** | Built exclusively with [Lucide React](https://lucide.dev/) icons (`Calendar`, `Clock`, `Globe`, `User`, `Mail`, `Video`, `CheckCircle2`), never random emojis. |
| **No "AI Slop" Photos** | Focuses entirely on clear functional UI layout, structured educator credentials, and clean vector badges. |
| **Accurate Timezone Coordination** | Standardized UTC scheduling engine that automatically calculates and displays both the parent's local time (e.g. `10:30 AM EDT`) and the mentor's local time (e.g. `8:00 PM IST`). |
| **Trust & Transparency** | Clear demonstration notices with dedicated Privacy Policy and Terms & Conditions disclaiming assignment demo context. |

---

## 🧭 The 5-Step Booking Flow

1. **Step 1 — Your Timezone**
   - Live local clock displaying the detected browser timezone.
   - Searchable global timezone selector with IANA IDs, city names, and UTC offsets.
   - Transparently indicates that all subsequent slots will adjust to the selected zone.

2. **Step 2 — Date & Time**
   - Learning track filter: *Scratch & Visual Coding*, *Python for Beginners*, *Web Development Basics*, *Math & Computational Logic*.
   - 14-day interactive date selector with responsive horizontal scroll.
   - Time slots grouped logically into Morning, Afternoon, and Evening.
   - Real-time mentor matching preview on each slot card showing educator name and mentor's local time.
   - Comprehensive empty and loading states.

3. **Step 3 — Parent & Student Details**
   - Form fields for parent contact (Full Name, Email, Phone/WhatsApp) and student details (Name, Age group, Prior coding experience, Optional learning goals).
   - Real-time validation with descriptive, accessible error messages.

4. **Step 4 — Review & Verification**
   - Side-by-side comparison of session details: Parent Local Time vs. Mentor Local Time.
   - Assigned educator credentials (degree, years of experience, languages).
   - Zero-cost ($0.00) free trial breakdown with clear policy consent.

5. **Step 5 — Booking Confirmation**
   - Clear confirmation banner with unique booking reference code (e.g. `#TC-82914`).
   - One-click Google Calendar event generation.
   - One-click `.ics` iCalendar file download for Apple Calendar / Outlook.
   - Direct button to launch the **Simulated Classroom Testing Room**.

---

## 👩‍🏫 Demo Educators Roster (10 Mentors)

Seeded specifically for this assignment without fake statistics or testimonials:

1. **Priya Nair** — Senior STEM & Coding Educator (IST / UTC+5:30) · *NIT Calicut*
2. **David Chen** — Computer Science Instructor (EDT / UTC-4:00) · *Univ of Michigan*
3. **Sarah Jenkins** — Web Technologies & Frontend Mentor (BST / UTC+1:00) · *Univ of Bristol*
4. **Amit Sharma** — Robotics & Logic Specialist (IST / UTC+5:30) · *Delhi University*
5. **Elena Rostova** — Creative Computing & Animation (CEST / UTC+2:00) · *TU Berlin*
6. **Marcus Vance** — Software Developer & Youth Mentor (PDT / UTC-7:00) · *Univ of Washington*
7. **Ananya Patel** — Early Childhood STEM Specialist (IST / UTC+5:30) · *Mumbai University*
8. **Liam O’Connor** — Applied Computing Mentor (BST / UTC+1:00) · *Trinity College Dublin*
9. **Fatima Al-Mansoor** — Curriculum & Coding Mentor (GST / UTC+4:00) · *Khalifa University*
10. **Carlos Mendez** — Interactive Computing Instructor (CDT / UTC-5:00) · *UT Austin*

---

## 💻 Tech Stack & Architecture

- **Core**: React 19, JavaScript (ES modules)
- **Tooling**: Vite 8, Oxlint
- **Styling**: Vanilla CSS with customized design system tokens (`--color-primary`, `--radius-md`, accessible focus rings)
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage with complete CRUD (create booking, view in "My Bookings", cancel appointment)

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your web browser.
