# Shuttle ETA — Live Demo Flow & Script

This guide outlines the step-by-step instructions to deliver a high-impact, bug-free, live demo of the **UNILAG Shuttle ETA** web app to the judges during the PESSA Innovation Challenge pitch.

---

## 🛠️ Pre-Demo Setup (Do this 10 mins before)

1. **Start the Server:**
   Run the app locally with `bun run dev` (or `pnpm dev`).
2. **Local Network Sharing (Crucial for Judge Scanning):**
   * Make sure your presentation laptop and the judges' mobile devices are on the same Wi-Fi network.
   * Open the app in your presentation browser using your machine's local IP address (e.g., `http://192.168.1.15:3000`) instead of `localhost:3000`. The dynamically generated QR code on the landing page will automatically adapt to point to this address!
3. **Open the Presenter Console:**
   * Look for the floating **Presenter Console** pill in the bottom-right corner.
   * Click **Reset Demo Environment** to ensure you start with clean baseline data.
4. **Prepare Browser Tabs:**
   * **Tab 1:** Landing page (`/` on the local IP).
   * **Tab 2:** PESSA Admin Console (`/dashboard` - sign in using any mock email, e.g., `admin@unilag.edu.ng` and password `demo1234`).

---

## 🎙️ Step-by-Step Demo Script & Transitions

### 1. The Setup & The Scannable QR Code
* **When to switch:** When your teammate finishes pitching **Slide 6 (The Tech)** and shows **Slide 7 (Live Demo)**.
* **What to do:** Switch to **Tab 1 (Landing Page)** on the projector screen. Scroll down to the **"Live Demo"** section.
* **What to say:**
  > *"To show you how frictionless this is, we've brought a live demo. We have no app to download, and zero configuration is required from the school. If you look at the screen, there is a dynamic QR code pointing to the Jaja Gate and Faculty pilot stop. Please pull out your phones and scan it right now."*

---

### 2. The Frictionless Rider View (Judge's Phone)
* **What to do:** On the projector, click the **"Click to try rider view"** link (or have a phone screen mirrored).
* **What to say:**
  > *"As soon as you scan, the mobile browser opens instantly. Notice that there is no app store redirection, no download wait, and no sign-up screens. It immediately shows that you are at the 'Faculty' stop. Next to it, you can see the next shuttle arrival ETA is calculated at 7 minutes, based on the baseline averages seeded by our team."*

---

### 3. Tapping "I'm on Shuttle A" (The Live Sync)
* **What to do:** Ask one of the judges to tap the large blue **"I'm on Shuttle A"** button on their phone.
* **What to say:**
  > *"Now, when Shuttle A pulls up at the stop, all the boarding student has to do is tap one single button: 'I'm on Shuttle A'. Go ahead and tap it."*
* **What happens on the screen:** The dashboard and recent activity feed on the projector will instantly update to show a new active ride, updating the ETA in real time across the entire campus.
* **What to say:**
  > *"Boom! The system registers the check-in instantly. No GPS hardware on the bus, no complex tracking. The student is the tracking network. Within seconds, the ETA gets updated for every student on campus looking at this stop."*

---

### 4. PESSA Operations Console (Admin Dashboard)
* **When to switch:** Switch to **Tab 2 (Dashboard)**.
* **What to do:** Point to the live widgets.
* **What to say:**
  > *"But where does this data go? It flows directly to PESSA and school administrators in our live Operations Dashboard. Here we can track active shuttles, current riders on board, and overall ETA accuracy. Below, you can see our live route map showing where the shuttle is between stops, a peak-hour heatmap showing exactly when queues build up, and a real-time check-in feed.*
  >
  > *This provides first-of-its-kind actionable data to help the university plan routes and advocate for better transport policies."*

---

### 5. Presenter Console Magic (Pro-Tip)
* **What to do:** Open the floating **Presenter Console** in the bottom-right corner of the dashboard. Click **"Simulate Rush Hour"**.
* **What happens:** The charts, heatmaps, and demand bars will instantly spike to show a populated, highly active network.
* **What to say:**
  > *"To demonstrate what this looks like under heavy load, we can simulate rush hour. As more student check-ins roll in, the system learns and adjusts the rolling average dynamically, automatically smoothing out outliers."*

---

### 6. Wrapping Up
* **When to switch:** Switch back to the pitch slides, showing **Slide 9 (Roadmap & Close)**.
* **What to say:**
  > *"We built this because students shouldn't have to guess if their class is missed. We're not asking for more buses—we're asking for the information students already deserve. Thank you."*

---

## 🚨 Troubleshooting during the Pitch

* **Issue: Judges can't scan or load the page.**
  * *Fix:* Point to the **Direct Link** box we added next to the QR code. Tell them to type the IP address shown directly into their mobile browser.
* **Issue: No Wi-Fi / Local Server connection is blocked.**
  * *Fix:* You can run the entire demo flow on your presentation laptop by opening two browser windows side-by-side (one at `/` and one at `/ride?stop=Faculty`). The Presenter Console allows you to simulate boarding and checkout actions directly on the screen!
