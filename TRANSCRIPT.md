# Codeyoung Full Stack Engineer Task — AI Session Transcript

> Full conversation transcript exported in accordance with submission guidelines for the Codeyoung Trial Class appointment booking assignment.

## Session Information
- **Task:** Codeyoung Trial Class Appointment-Booking System
- **Candidate Context:** Full Stack Engineer Trial Class Assignment
- **Export Date:** 2026-09-26T15:23:51.375Z

---



## 👤 Turn 1 — User Prompt

`	ext
<USER_REQUEST>
==================================================
DESIGN QUALITY — IMPORTANT
==================================================

The final website MUST NOT look like an "AI-generated / vibe-coded" website.

The screenshot/reference provided by the user highlights common design mistakes that must be avoided.

The goal is a professional, trustworthy education technology product that looks like it was designed and reviewed by a real product/design team.

==================================================
DESIGN PRINCIPLES
==================================================

DO:

- Use a clean, professional education-tech design.
- Use a restrained and consistent color palette.
- Use strong typography hierarchy.
- Use generous but intentional spacing.
- Use clear visual hierarchy.
- Use consistent border radius.
- Use subtle shadows only where useful.
- Use accessible contrast.
- Use meaningful icons where appropriate.
- Use professional illustrations or simple UI graphics when needed.
- Make the booking process extremely clear.
- Make important information visually prominent.
- Keep the interface calm and trustworthy.
- Make the website feel like a real production product.
- Make responsive behavior intentional for mobile, tablet, and desktop.
- Use real UI states rather than decorative elements.
- Keep animations subtle and purposeful.
- Make buttons visually consistent.
- Make forms easy to understand.
- Clearly communicate timezone information.
- Clearly communicate booking status.

DO NOT:

1. DO NOT use excessive purple gradients.

2. DO NOT use random gradient backgrounds just because they look "AI-generated".

3. DO NOT use pill-shaped buttons everywhere.

   Buttons should normally have a moderate border radius and clear hierarchy.

4. DO NOT use fake reviews.

   Do not invent:
   - customer testimonials
   - parent reviews
   - ratings
   - star counts
   - quotes
   - success stories

5. DO NOT use fake metrics.

   Do not invent
<truncated 12287 bytes>
king CTA obvious?
4. Are the timezones understandable?
5. Are there unnecessary animations?
6. Are there fake claims?
7. Does anything look AI-generated?
8. Are there random gradients?
9. Are buttons consistent?
10. Are icons consistent?
11. Is there unnecessary content?
12. Does the mobile UI look intentional?
13. Are loading/error/success states polished?
14. Does the page feel trustworthy?
15. Does the design help the parent complete the booking quickly?

If any answer is poor, improve the design before finalizing.

==================================================
REFERENCE DESIGN RULE
==================================================

The user provided a visual reference showing common "vibe-coded website" mistakes.

Use it as a NEGATIVE design reference.

Specifically avoid:

❌ Purple gradients
❌ Pill-shaped buttons everywhere
❌ Fake reviews
❌ Fake metrics
❌ Vague hero copy
❌ Emoji-based UI
❌ Excessive em dashes
❌ Crazy scroll animations
❌ AI-generated/slop photographs
❌ AI-generated/slop marketing copy
❌ Cursor animations
❌ Fake customer counters

Instead build:

✅ Clear product messaging
✅ Professional typography
✅ Consistent design system
✅ Useful UI
✅ Real booking functionality
✅ Accurate timezone handling
✅ Subtle animations
✅ Realistic demo data
✅ Trustworthy content
✅ Responsive design
✅ Privacy Policy
✅ Terms & Conditions
✅ Professional favicon
✅ Production-quality error/loading states

The final result should look like a carefully designed full-stack product, not an AI-generated landing page.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-26T19:25:47+05:30.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 3.8 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>
`

### 🤖 Assistant Response

### TrialClass — Professional 1-on-1 Trial Class Scheduling Platform

The trial class booking platform has been implemented adhering to all specifications and negative design guidelines. The website is live on the local development server at **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**.

---

### Key Implementations & Design Quality Alignment

#### 1. Negative Design Principles Strictly Followed
- **No Purple Gradients / Vibe-Coded Effects:** Built with a restrained, trustworthy color system consisting of deep royal blue (`#1E40AF`), slate neutrals (`#0F172A`, `#334155`), and clean accessible borders (`#E2E8F0`).
- **No Pill Buttons Everywhere:** Application buttons use intentional, moderate border radius (6px - 8px) with distinct visual hierarchies (`btn-primary`, `btn-secondary`, and `btn-ghost`).
- **Zero Fake Reviews & Metrics:** No invented testimonials, no fake star ratings, no fake parent counters, and no marketing puffery.
- **Natural, Product-Focused Copy:** Clear and direct communication:
  - *Headline:* "Book a Free Trial Class"
  - *Supporting Text:* "Choose a convenient time for your child and we'll match you with an available mentor."
- **Professional Icons:** Exclusively using [Lucide React](https://lucide.dev/) icons (`Calendar`, `Clock`, `Globe`, `User`, `Mail`, `Video`, `CheckCircle2`, `ArrowRight`). Zero random emojis used as UI icons.
- **No AI-Generated Photos:** Focused entirely on clean typography (Google Fonts *Plus Jakarta Sans*), structured educator credentials, and clean layout cards.

---

### The 5-Step Scheduling Flow

| Step | Features & Behavior |
|---|---|
| **Step 1 — Your Timezone** | Displays detected browser timezone and current live local clock. Provides a searchable directory of global timezones (EDT, PDT, GMT, BST, IST, SGT, AEST, etc.) with UTC offsets and cities. Explains clearly that all subsequent class times convert to this selected timezone. |
| **Step 2 — Date & Time** | Filter by learning track (*Scratch & Visual Coding*, *Python for Beginners*, *Web D
<truncated 1184 bytes>
ad iCal (.ics) ]` <br>• `[ Book Another Trial ]` |

---

### Additional Production Features

1. **Interactive Demo Classroom (`[ Join Demo Class ]`):**
   - Pre-class hardware check (microphone and camera toggles with live status indicators).
   - Welcome banner with assigned mentor and scheduled times.
   - Interactive code editor canvas preview with executable test code and simulated console output.
   - 45-minute lesson agenda breakdown.

2. **10 Demo Mentors Seeded for Assignment:**
   - Mentors dataset ([src/data/mentors.js](file:///c:/Users/ASUS/Desktop/Trail_Class/src/data/mentors.js)) featuring Priya Nair, David Chen, Sarah Jenkins, Amit Sharma, Elena Rostova, Marcus Vance, Ananya Patel, Liam O'Connor, Fatima Al-Mansoor, and Carlos Mendez across various timezones with real university backgrounds, years of experience, and subjects.
   - Accessible via the **Mentors (10)** directory modal in the header.

3. **Session Management ("My Bookings"):**
   - Bookings are persisted in browser `LocalStorage`.
   - Parents can inspect booked sessions, download calendar files, join demo rooms, or cancel sessions.

4. **Trust & Transparency:**
   - Dedicated modal dialogs for **Privacy Policy** and **Terms & Conditions** clearly stating this is a technical demonstration/assignment prototype.
   - Custom SVG brand favicon and clean metadata without default Vite branding.

---

### Browser Environment Notice

> [!NOTE]
> During automated end-to-end browser testing, the `open_browser_url` tool encountered a Microsoft Azure CDN driver issue (*Playwright driver version 1.57.0 returned 404 from `https://playwright.azureedge.net/builds/driver/`*).
> 
> The application itself is running and responding with `HTTP 200 OK` on **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**. You can open this URL directly in Chrome, Edge, or your preferred browser to interact with the full experience.

Please let me know how you would like to proceed or if you'd like any adjustments to the scheduling flow, styling, or mentor matching logic!

---


## 👤 Turn 2 — User Prompt

`	ext
<USER_REQUEST>
Microsoft Windows [Version 10.0.26200.9550]
(c) Microsoft Corporation. All rights reserved.

C:\Users\ASUS\Desktop\Trail_Class>git merge origin/Templ
merge: origin/Templ - not something we can merge

C:\Users\ASUS\Desktop\Trail_Class>git merge origin/Templ
merge: origin/Templ - not something we can merge

C:\Users\ASUS\Desktop\Trail_Class>

</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-26T20:10:12+05:30.

The user's current state is as follows:
Active Document: c:\Users\ASUS\Desktop\Trail_Class\README.md (LANGUAGE_MARKDOWN)
Cursor is on line: 1
Other open documents:
- c:\Users\ASUS\Desktop\Trail_Class\README.md (LANGUAGE_MARKDOWN)
</ADDITIONAL_METADATA>
`

### 🤖 Assistant Response

The error occurred because of a small typo in the branch name:

1. **Typo in Branch Name:**
   The command entered was:
   ```bash
   git merge origin/Templ   # ended with the letter 'l'
   ```
   The branch name ends with the digit **`1`** (`Temp1`), not the letter `l`.

2. **Local vs Remote:**
   The feature commit was made on your local branch `Temp1`.

---

### Current Status

The merge has been completed. `Temp1` is merged into `main`:

```bash
commit 440001d (HEAD -> main)
Merge: 68dc253 63d842a
Author: Prajwal R Poojary
Date:   Sat Sep 26 20:12:05 2026 +0530

    Merge branch 'Temp1'
```

- **Branch:** `main`
- **Working Tree:** Clean (all files merged)
- **Production Build:** Tested and passing (`npm run build` compiled with 0 errors in 254ms)
- **Local Dev Server:** Running at [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

---


## 👤 Turn 3 — User Prompt

`	ext
<USER_REQUEST>
Full stack Engineer Task:
At Codeyoung, parents have the option to book a “trial class” to experience our product and the quality coaching our mentors provide before signing up.
This is the flow parents usually go through:
1. Parents pick a time slot that’s comfortable for them.
2. We assign an available mentor
3. We email both the mentor and the parent a link that takes them to a live class.
The task is to build a similar appointment-booking system which has:
· 10 mentors available for trial classes
· 20 parents interested in booking a trial class per day
Build a web app that parents can use to book this trial class. You should use NodeJS or Python for any backend APIs and React for the frontend.
Feel free to use any other backend or frontend libraries.
Requirements:
1. Mentors and parents may be in different time zones. Usually, parents are in the US or UK, and mentors are in India. Please make sure local times are always displayed and communicated to them.
2. Daylight Savings Time is a niggle you have to handle.
3. Parents and mentors can receive a dummy link. It’s assumed that the link will work and will take them to a demo class.
4. Mentors have at most 2 demo classes a day.
5. If no mentors are available, use your judgment to communicate an appropriate error state.
Submission:
1. You are encouraged to use an AI assistant to solve this task.
2. Submit the solution as a Github repo link which has a README.md that describes how to run the project.
3. You should also submit a full transcript (both your prompts and agent responses) of your AI sessions. (/export in Claude code for example).
4. Submit it as TRANSCRIPT.md in the Github repo.
5. All the above mentioned should be submitted to the email id: [campus.ka@talentiseglobal.com](mailto:campus.ka@talentiseglobal.com) within 28th of September 2026 (Latest by 6:00 PM)
6. The subject line of the assignment submission task email should be like: Codeyoung Assignment Task - <Candidate Name> - Institute Name (ABBR)
Evaluation:
1. If you have questions about edge cases or more requirements, we expect you to research Codeyoung & similar systems to understand how they solve similar cases.
2. A good part of this evaluation is what you do & don’t build.
3. Your product should be usable. Your design sense, and how much you think from a customer PoV will be evaluated.
4. Code-level architecture and design patterns you use, and how you guide the AI to write good, maintainable code is another pillar criterion.
WHETHER IT MEET ABOVE ALL
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-26T20:14:02+05:30.

The user's current state is as follows:
Active Document: c:\Users\ASUS\Desktop\Trail_Class\README.md (LANGUAGE_MARKDOWN)
Cursor is on line: 1
Other open documents:
- c:\Users\ASUS\Desktop\Trail_Class\README.md (LANGUAGE_MARKDOWN)
</ADDITIONAL_METADATA>
`

