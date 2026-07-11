#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  header: align(right, text(8pt, fill: gray)[Shuttle ETA — Live Demo Guide]),
  footer: context [
    #align(center, text(8pt, fill: gray)[Page #counter(page).display()])
  ]
)

#set text(
  font: "Liberation Sans",
  size: 11pt,
  hyphenate: false
)

#align(center)[
  #text(20pt, weight: "bold", fill: rgb("#0f172a"))[Shuttle ETA] \
  #v(2mm)
  #text(14pt, weight: "medium", fill: rgb("#0284c7"))[2-3 Min Live Demo Script & Flow] \
  #text(10pt, fill: gray)[PESSA Innovation Challenge 2026]
]

#v(8mm)

== 🛠️ Quick Pre-Demo Setup

1. *Open Tab 1 (Projector view):* Load the homepage (`/`) on your Vercel deployment. Keep the *Live Demo* section visible on the screen.
2. *Open Tab 2 (Admin view):* Load the dashboard `/dashboard` page and click *Continue as Guest (Anonymous)* to sign in instantly.
3. *Reset Environment:* In the bottom-right corner, open the *Presenter Console* pill and click *Reset Demo Environment* to clean baseline averages.

#v(4mm)

== 🎙️ Step-by-Step Presentation Script

=== ⏱️ Minute 0:00 - 0:45 | Step 1: Scan & Frictionless Access
*Action:* Keep *Tab 1* (Homepage) projected. Ask the judges to scan the dynamic QR code on the screen.

*Script:*
#rect(fill: rgb("#f8fafc"), stroke: rgb("#e2e8f0"), inset: 12pt, width: 100%)[
  _"To show you how frictionless this is, let's look at the live demo. There is no app store redirection, no download wait, and no sign-up forms required. Judges, please pull out your phones and scan the QR code on the screen right now._

  _Once scanned, your phone immediately opens the rider view. It shows you're at the 'Faculty' stop, and calculated the ETA for the next shuttle is 12 minutes."_
]

#v(2mm)

=== ⏱️ Minute 0:45 - 1:30 | Step 2: Selecting Destination & Boarding (Sync)
*Action:* Ask one of the judges to select their destination and tap *I'm on Shuttle A* on their phone.

*Script:*
#rect(fill: rgb("#f8fafc"), stroke: rgb("#e2e8f0"), inset: 12pt, width: 100%)[
  _"Notice that we don't just track where you board—you select your destination as well. Go ahead and select 'PESSA' as where you're going, then tap the blue 'I'm on Shuttle A' button on your phone._

  _Boom! Notice the screen instantly updates. The student is the tracking network. When you arrive and tap 'I'm off', the system logs your trip to our persistent database. Scroll down on your phone, and you will see your trip successfully added to the live Campus Completed Trips History!"_
]

#v(2mm)

=== ⏱️ Minute 1:30 - 2:15 | Step 3: Admin Console & Dashboards
*Action:* Switch to *Tab 2* (Dashboard) on your laptop. Show the difference between the Admin view and Guest Rider view.

*Script:*
#rect(fill: rgb("#f8fafc"), stroke: rgb("#e2e8f0"), inset: 12pt, width: 100%)[
  _"This data flows directly to school operators. In our PESSA Operations Console, admin can track active shuttles, riders, and watch our live route map in real-time. In our Recent Trips log, you can see the exact trip you just recorded has popped up at the top of the queue._

  _(Click 'Simulate Rush Hour' on the bottom-right Presenter Console)_

  _If we simulate rush hour, you'll see the charts, heatmaps, and demand boards dynamically spike, showing how our system scales to guide school transport planning."_
]

#v(2mm)

=== ⏱️ Minute 2:15 - 2:30 | Wrap-up
*Script:*
#rect(fill: rgb("#f8fafc"), stroke: rgb("#e2e8f0"), inset: 12pt, width: 100%)[
  _"We aren't asking for more buses—we're asking for the information students already deserve. Stop guessing, start knowing. Thank you."_
]

#v(4mm)

== 🚨 Troubleshooting (If Wi-Fi fails)
- *If judges can't connect/scan:* Open two tabs side-by-side on your presentation laptop: one at `/` and one at `/ride?stop=Faculty`. Click *I'm on Shuttle A* on the right window and watch the left window update. Explain that this represents what the judge would see on their phone.
