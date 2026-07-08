# UNILAG Shuttle ETA
### PESSA Innovation Challenge 2026 — Team Pitch Deck

---

## Slide 1: The Hook (Title Slide)
**Title:** UNILAG Shuttle ETA: Stop Guessing, Start Knowing.
**Visual:** A stressed student checking their watch at a crowded shuttle stop.
**Talking Point:** "It’s 7:40am at Jaja Gate. You have an 8am lab. You've been waiting for 15 minutes, but you have no idea if the shuttle is 2 minutes away or 40. Every UNILAG student knows this feeling—standing there with zero visibility, just hoping."

---

## Slide 2: The Problem
**Title:** The Problem Isn't Buses. It's Visibility.
**Visual:** Bullet points with icons (clock, long queue, stressed driver).
**Points:**
- **Lost Time:** Students wait 20-30 mins daily, missing classes or leaving way too early.
- **Chaos at Stops:** Long, disorganized queues form the second a bus is spotted.
- **Driver Distraction:** Drivers are constantly bombarded with "How far?" instead of focusing on the road.

---

## Slide 3: The Solution
**Title:** The Solution: UNILAG Shuttle ETA
**Visual:** A mockup of a smartphone displaying the clean, minimalist ETA interface.
**Points:**
- A lightweight, mobile-first web app.
- **No App Download:** Works via a simple browser link or QR code.
- **No Login:** Frictionless access for anyone on campus.
- **Zero Cost to the School:** No expensive GPS hardware or fleet management systems required.

---

## Slide 4: How It Works
**Title:** Powered by the Students (Crowdsourced Tracking)
**Visual:** A simple 3-step flowchart: Scan QR -> Tap "I'm On" -> Tap "I'm Off".
**Points:**
- **Step 1:** Scan a QR code printed at the shuttle stop.
- **Step 2:** Tap "I'm on Shuttle A" when boarding.
- **Step 3:** Tap "I'm off" upon arrival (with auto-checkout as a fallback).
- **The Magic:** The system learns real travel times from student taps, continuously updating a smart rolling average.

---

## Slide 5: The "Cold Start" Validation
**Title:** It Works from Tap #1
**Visual:** A photo or graphic of the team walking the route with a stopwatch.
**Talking Point:** "The first question is always: 'What happens before anyone uses it?' We didn't wait. We physically walked and rode the Gate → Faculty → PESSA route 8 to 10 times to seed the baseline average. The app works instantly; student check-ins just make it more accurate."

---

## Slide 6: The Tech (Keep It Boring & Reliable)
**Title:** Built to Scale, Designed Not to Crash
**Visual:** Simple architecture diagram (Frontend -> Backend/DB).
**Points:**
- **Frontend:** React-based single page application, optimized for slow mobile networks.
- **Backend:** Fast check-in endpoints with rolling-average calculations and auto-expiry jobs.
- **Live Updates:** Polling every 5–10 seconds for real-time ETA adjustments.
- **Why this matters:** No WhatsApp dependencies, no Meta approval queues, just a system that works end-to-end today.

---

## Slide 7: Live Demo
**Title:** Let’s See It In Action
**Visual:** A massive, scannable QR code on screen.
**Action:** 
- Ask judges to pull out their phones and scan the QR code.
- Have a judge tap "I'm on Shuttle A".
- Watch the ETA update live on the main presentation screen within seconds.
**Talking Point:** "One working loop beats five described features. You just updated the ETA for the entire campus."

---

## Slide 8: The Impact
**Title:** Data-Driven Campus Transit
**Visual:** A dashboard graphic showing peak times and wait durations.
**Points:**
- **For Students:** Thousands of hours saved every week. Less stress, more time studying.
- **For PESSA/Admin:** First-of-its-kind actionable data. Know the real peak hours, busy stops, and wait times to advocate for better transport policies.
- **Economic Value:** Maximum impact with absolute zero hardware deployment costs.

---

## Slide 9: The Roadmap & Close
**Title:** Beyond the Hackathon
**Visual:** Map of other universities (FUTA, OAU, ABU, UI).
**Points:**
- **Next Steps:** Map visualization, gamified check-ins, and a dedicated admin dashboard.
- **Expansion:** The problem isn't unique to UNILAG. We can port this to FUTA, OAU, ABU, and UI.
- **Closing Statement:** "We're not asking for more buses. We're asking for the information students already deserve. Thank you."
