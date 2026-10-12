export const PAL = [["#19d3ff","#0a5fd1"],["#ff2d3d","#8f0a1c"],["#b14cff","#3b1a9e"],["#19d3ff","#ff2d3d"],["#ff7a3d","#b3122a"],["#00e5c3","#0a6fa8"]];

export const DOMAINS = [
  { id: "ai", icon: "AI", name: "AI & Machine Learning", color: "#7c5cff", blurb: "Smarter systems that learn and adapt.",
    problems: [
      { t: "Multilingual Voice Assistant", d: "Build a voice assistant that serves rural users in regional languages with low bandwidth.", tags: ["NLP", "Speech"], g: ["#7c5cff", "#4b2fd1"] },
      { t: "Deepfake Detector", d: "Detect manipulated images and video in real time and explain why they were flagged.", tags: ["Vision", "Trust"], g: ["#ff5ca8", "#b3226b"] },
      { t: "Personal Study Coach", d: "An adaptive tutor that finds knowledge gaps and builds a custom revision plan.", tags: ["LLM", "Edu"], g: ["#2ad4ff", "#0b78a8"] } ] },
  { id: "health", icon: "HT", name: "HealthTech", color: "#22c68a", blurb: "Care that is accessible and early.",
    problems: [
      { t: "Early Symptom Triage", d: "Guide patients to the right level of care using simple, privacy-first inputs.", tags: ["Triage", "Privacy"], g: ["#22c68a", "#0d7a52"] },
      { t: "Medication Adherence", d: "Help elderly patients stay on schedule with reminders and caregiver alerts.", tags: ["IoT", "Mobile"], g: ["#f5a524", "#b86e00"] } ] },
  { id: "green", icon: "GR", name: "Sustainability", color: "#8bd13f", blurb: "Tech for a greener planet.",
    problems: [
      { t: "Campus Carbon Tracker", d: "Measure and visualise the carbon footprint of a campus or neighbourhood.", tags: ["Data", "Dashboard"], g: ["#8bd13f", "#4a7d12"] },
      { t: "Smart Waste Sorting", d: "Make waste segregation effortless using vision and gamified feedback.", tags: ["Vision", "Hardware"], g: ["#14b8a6", "#0b6b60"] },
      { t: "Water Leak Alerts", d: "Detect and locate leaks in building or village pipelines early.", tags: ["IoT", "Alerts"], g: ["#3b82f6", "#1e47a0"] } ] },
  { id: "sec", icon: "SC", name: "Cybersecurity", color: "#ff5c5c", blurb: "Defend people and data online.",
    problems: [
      { t: "Phishing Shield", d: "A browser tool that spots and explains scam links and messages instantly.", tags: ["Browser", "ML"], g: ["#ff5c5c", "#a31d1d"] },
      { t: "Password-less Login", d: "Design a secure, friendly authentication flow without passwords.", tags: ["Auth", "UX"], g: ["#a855f7", "#5e1e9e"] } ] },
  { id: "fin", icon: "FT", name: "FinTech & Web3", color: "#f5a524", blurb: "Open, inclusive money tools.",
    problems: [
      { t: "Micro-Savings for Students", d: "Round-up savings and goal tracking built for first-time earners.", tags: ["Mobile", "UPI"], g: ["#f5a524", "#a86500"] },
      { t: "Transparent Donations", d: "Let donors trace every contribution to its real-world impact.", tags: ["Blockchain", "Trust"], g: ["#6366f1", "#2e31a8"] } ] },
  { id: "edu", icon: "OI", name: "Open Innovation", color: "#2ad4ff", blurb: "Your idea, your rules.",
    problems: [
      { t: "Wildcard Challenge", d: "Pitch your own problem and solution. Impact and originality count the most.", tags: ["Any stack"], g: ["#2ad4ff", "#0a6f93"] } ] },
];

// Set iso to a real date (e.g. "2026-11-20T00:00:00+05:30") and each step's status updates automatically.
export const DATES = [
  { t: "Registrations open", d: "Form a team of 2 to 4 and register on the portal.", iso: null },
  { t: "Registration closes", d: "Last day to register your team.", iso: null },
  { t: "Idea submission", d: "Submit a short abstract for your chosen problem.", iso: null },
  { t: "Shortlist announced", d: "Selected teams are notified by email.", iso: null },
  { t: "Hackathon begins", d: "Kick-off, mentor sessions and the build sprint.", iso: null },
  { t: "Final pitches", d: "Present your demo to the judges. Winners are announced.", iso: null },
];

export const FAQS = [
  ["Who can participate?", "Eligibility details will be announced soon."],
  ["What is the team size?", "Teams of 2 to 4 members."],
  ["Is there a registration fee?", "Fee details will be announced soon."],
  ["What do we need to submit?", "A short abstract for your chosen problem, then a working demo in the final round."],
  ["Can we bring our own idea?", "Yes. Choose Open Innovation and pitch your own problem."],
  ["Is it online or offline?", "Idea submission is online. The final round is held in person."],
];

export const EVENT = new Date("2026-12-15T09:00:00+05:30"); // placeholder: set your real start date

export const SECS = [["top", "Home"], ["about", "About"], ["problems", "Domains"], ["countdown", "Countdown"], ["dates", "Timeline"], ["qa", "Q&A"], ["partners", "Partners"], ["contact", "Contact"]];

