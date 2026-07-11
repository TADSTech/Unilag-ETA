#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  header: align(right, text(8pt, fill: gray)[Shuttle ETA — Pitch Q&A Sheet]),
  footer: context [
    #align(center, text(8pt, fill: gray)[Page #counter(page).display()])
  ]
)

#set text(
  font: "Liberation Sans",
  size: 10.5pt,
  hyphenate: false
)

#align(center)[
  #text(20pt, weight: "bold", fill: rgb("#0f172a"))[Shuttle ETA] \
  #v(2mm)
  #text(13pt, weight: "medium", fill: rgb("#0284c7"))[Pitch Q&A & Judge Preparation Sheet] \
  #text(9pt, fill: gray)[PESSA Innovation Challenge 2026]
]

#v(6mm)

== 💰 Category 1: Economics, Hosting & Cost

=== Q1: Why not just install physical GPS trackers on the buses?
- *Answer:* GPS fleet hardware (like Samsara or custom OBD trackers) costs roughly *\$150 per bus upfront*, plus a *\$30 per month per-bus* subscription fee. For UNILAG's fleet of ~20 shuttles, that translates to *\$3,000 upfront and \$7,200 per year*. 
- Furthermore, physical hardware is prone to theft, driver tampering, power failures, and requires maintenance staff. Shuttle ETA turns the passengers into the tracking network, reducing the hardware footprint and operating cost to absolute zero.

=== Q2: What is your exact hosting cost structure at scale?
- *Scale 1: Pilot Phase (1,000 riders/day):* *\$0 per month*. We fit 100% within the free tier of Vercel (static edge rendering) and Upstash Redis / Supabase (10k DB operations/day). Only cost is the domain name (~\$10 per year).
- *Scale 2: Full Campus Launch (10,000+ riders/day):* *~\$30 per month (~\$360 per year)*. Requires Vercel Pro (\$20/mo) for team limits and Upstash Redis Pro (\$10/mo) to support unlimited writes.

=== Q3: How do you plan to monetize this or sustain the cost?
- The annual operational cost is so low (~\$360) that it can be directly funded by the Student Union (PESSA) budget. 
- Alternatively, we can place a single local banner ad at the bottom of the Rider Page (e.g., local food vendors or bookstores near campus), which would cover the yearly server costs in a single week.

#v(4mm)

== 👥 Category 2: Student Behavior & Data Integrity

=== Q4: Why would a student bother to tap "I'm on" or "I'm off"?
- *Incentive Structure:* Tapping is a mutual benefit. If students want accurate ETAs when they are waiting at the stop, they will naturally board and tap to keep the system alive. 
- *Next Steps:* In the roadmap, we plan to implement *Gamified Taps*. Students earn "Rider Points" on their anonymous profile for boarding/alighting check-ins, which can be redeemed for campus discounts (e.g., typing/photocopying services, snack vendors).

=== Q5: What if students spam the buttons or submit fake check-ins to ruin the ETAs?
- *Rate Limiting & Session IDs:* Each device is assigned a unique anonymous session ID in local storage. A device can only have *one active ride* at a time.
- *Outlier Filtering:* The server-side algorithm filters out statistical anomalies (e.g., if a student check-in registers a Faculty-to-Moremi trip in 30 seconds, it's discarded). We calculate a smart rolling average that ignores outliers.
- *Auto-Checkout:* If a rider boarding at Gate forgets to tap "I'm off" at PESSA, the system automatically checks them out after 45 minutes to keep active logs clean.

=== Q6: What happens if nobody checks in or taps on a particular day?
- The system automatically defaults to our *Cold Start Validation* baseline. Our team physically walked and timed the route 8-10 times, establishing an accurate baseline average. The app will display this baseline timing until new taps override it.

#pagebreak()

== ⚙️ Category 3: Technology & Offline Access

=== Q7: Why did you build a web app instead of a native mobile app (iOS/Android)?
- *Zero Friction:* Students standing at Jaja Gate in a rush will *never* download a 40MB app from the App Store, register an account, and wait for confirmation. 
- Shuttle ETA works instantly on any phone. Scanning the QR code opens a lightweight mobile website in *under 2 seconds*, even on weak 3G networks.

=== Q8: How does the system handle poor internet connectivity at shuttle stops?
- The website is optimized as a progressive single-page application. 
- It caches core assets locally. Boarding and checkout payloads are extremely lightweight (less than 1KB of JSON data), ensuring they send successfully even with very weak data signals.

=== Q9: How exactly is the ETA calculated?
- The ETA is computed using the average transit duration between stops from recent trips.
- When a shuttle is active (at least one check-in exists), we find the oldest active ride (which represents the shuttle furthest along the route) and measure the elapsed time since its board event to estimate remaining minutes to the next stops.

#v(4mm)

== 🚀 Category 4: Rollout & Future Plans

=== Q10: How do you register drivers and shuttles?
- We don't! The system tracks *passenger flow*, not individual drivers. The app doesn't care which driver is operating which bus. It only tracks when a passenger boards "Shuttle A" (our pilot route line) at a stop, meaning it is 100% driver-independent.

=== Q11: How do you plan to expand beyond the Jaja-PESSA route?
- *UNILAG Expansion:* In week 2, we will generate QR codes for all other campus routes (New Hall, Moremi, Medical Center, etc.) and print them at their respective stops.
- *Inter-university Expansion:* Because the app requires zero hardware and uses a static configuration file for stops, we can port it to other major campuses (FUTA, OAU, ABU, UI) in under 48 hours by simply swapping the stop names configuration file.
