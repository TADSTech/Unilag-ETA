# Shuttle ETA — 2-3 Min Live Demo Script & Flow

This script is designed for a fast-paced, high-impact **2 to 3-minute live demo** to run immediately after your teammate finishes presenting the slides.

---

## 🛠️ Quick Pre-Demo Setup

1. **Open Tab 1 (Projector view):** Load the homepage (`/`) on your Vercel deployment. Keep the **"Live Demo"** section visible.
2. **Open Tab 2 (Admin view):** Load the dashboard `/dashboard` page and click **"Continue as Guest (Anonymous)"** to sign in instantly.
3. **Reset:** In the bottom-right corner, open the **Presenter Console** pill and click **Reset Demo Environment** to clean baseline averages.

---

## 🎙️ Step-by-Step Presentation Script

### ⏱️ Minute 0:00 - 0:45 | Step 1: Scan & Frictionless Access
* **Action:** Keep **Tab 1** (Homepage) projected. Ask the judges to scan the dynamic QR code on the screen.
* **Script:**
  > *"To show you how frictionless this is, let's look at the live demo. There is no app store redirection, no download wait, and no sign-up forms required. Judges, please pull out your phones and scan the QR code on the screen right now.*
  >
  > *Once scanned, your phone immediately opens the rider view. It shows you're at the 'Faculty' stop, and calculated the ETA for the next shuttle is 12 minutes."*

---

### ⏱️ Minute 0:45 - 1:30 | Step 2: Selecting Destination & Boarding (Sync)
* **Action:** Ask one of the judges to select their destination and tap **"I'm on Shuttle A"** on their phone.
* **Script:**
  > *"Notice that we don't just track where you board—you select your destination as well. Go ahead and select 'PESSA' as where you're going, then tap the blue 'I'm on Shuttle A' button on your phone.*
  >
  > *Boom! Notice the screen instantly updates. The student is the tracking network. When you arrive and tap 'I'm off', the system logs your trip to our persistent database. Scroll down on your phone, and you will see your trip successfully added to the live Campus Completed Trips History!"*

---

### ⏱️ Minute 1:30 - 2:15 | Step 3: Admin Console & Dashboards
* **Action:** Switch to **Tab 2** (Dashboard) on your laptop. Show the difference between the Admin view and Guest Rider view.
* **Script:**
  > *"This data flows directly to school operators. In our PESSA Operations Console, admin can track active shuttles, riders, and watch our live route map in real-time. In our Recent Trips log, you can see the exact trip you just recorded has popped up at the top of the queue.*
  >
  > *(Click 'Simulate Rush Hour' on the bottom-right Presenter Console)*
  >
  > *If we simulate rush hour, you'll see the charts, heatmaps, and demand boards dynamically spike, showing how our system scales to guide school transport planning."*

---

### ⏱️ Minute 2:15 - 2:30 | Wrap-up
* **Script:**
  > *"We aren't asking for more buses—we're asking for the information students already deserve. Stop guessing, start knowing. Thank you."*

---

## 🚨 Troubleshooting (If Wi-Fi fails)
* **If judges can't connect/scan:**
  * Open two tabs side-by-side on your presentation laptop: one at `/` and one at `/ride?stop=Faculty`.
  * Click **"I'm on Shuttle A"** on the right side and watch the left side update. Explain that this represents what the judge would see on their phone.
