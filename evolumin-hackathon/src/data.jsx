export const ART = {
  ai: <g><circle cx="40" cy="30" r="7"/><circle cx="40" cy="90" r="7"/><circle cx="100" cy="20" r="7"/><circle cx="100" cy="60" r="7"/><circle cx="100" cy="100" r="7"/><circle cx="160" cy="60" r="7"/><path d="M47 30L93 20M47 30L93 60M47 90L93 60M47 90L93 100M107 20L153 60M107 60L153 60M107 100L153 60"/></g>,
  health: <g><path d="M10 70H55L70 30L95 105L115 50L130 70H190"/><circle cx="100" cy="60" r="52" opacity=".4"/></g>,
  green: <g><path d="M60 100C60 40 110 20 160 20C160 70 120 100 60 100Z"/><path d="M60 100L130 50"/><circle cx="40" cy="30" r="12" opacity=".5"/></g>,
  sec: <g><path d="M100 10L160 32V65C160 90 135 105 100 112C65 105 40 90 40 65V32Z"/><circle cx="100" cy="58" r="10"/><path d="M100 68V84"/></g>,
  fin: <g><path d="M30 100V70M70 100V50M110 100V60M150 100V25"/><path d="M20 105H180"/><circle cx="165" cy="20" r="12"/></g>,
  open: <g><circle cx="100" cy="48" r="28"/><path d="M88 80H112M91 90H109M100 8V0M60 20L52 12M140 20L148 12M40 48H28M160 48H172"/></g>,
};

export const Art = ({ id }) => <svg viewBox="0 0 200 120" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{ART[id]}</svg>;

export const DOMAINS = [
  ["ai", "AI & Machine Learning", "Smarter systems that learn and adapt.", [["Multilingual Voice Assistant", "Build a voice assistant that serves rural users in regional languages with low bandwidth."], ["Deepfake Detector", "Detect manipulated images and video in real time and explain why they were flagged."], ["Personal Study Coach", "An adaptive tutor that finds knowledge gaps and builds a custom revision plan."]]],
  ["health", "HealthTech", "Care that is accessible and early.", [["Early Symptom Triage", "Guide patients to the right level of care using simple, privacy-first inputs."], ["Medication Adherence", "Help elderly patients stay on schedule with reminders and caregiver alerts."]]],
  ["green", "Sustainability", "Technology for a greener planet.", [["Campus Carbon Tracker", "Measure and visualise the carbon footprint of a campus or neighbourhood."], ["Smart Waste Sorting", "Make waste segregation effortless using vision and gamified feedback."], ["Water Leak Alerts", "Detect and locate leaks in building or village pipelines early."]]],
  ["sec", "Cybersecurity", "Defend people and data online.", [["Phishing Shield", "A browser tool that spots and explains scam links and messages instantly."], ["Password-less Login", "Design a secure, friendly authentication flow without passwords."]]],
  ["fin", "FinTech & Web3", "Open, inclusive money tools.", [["Micro-Savings for Students", "Round-up savings and goal tracking built for first-time earners."], ["Transparent Donations", "Let donors trace every contribution to its real-world impact."]]],
  ["open", "Open Innovation", "Your idea, your rules.", [["Wildcard Challenge", "Pitch your own problem and solution. Impact and originality count the most."]]],
].map(([id, name, blurb, problems]) => ({ id, name, blurb, problems }));

export const STAGES = [
  ["Registrations open", "Form a team of 2 to 4, register on the portal and pick a domain and problem statement."],
  ["Registration closes", "Last day to register your team. Late entries cannot be accepted."],
  ["Idea submission", "Submit a short abstract covering the problem, your approach and the expected outcome."],
  ["Shortlist announced", "Selected teams are notified by email with the venue and the schedule."],
  ["Hackathon begins", "Kick-off, mentor sessions and the build sprint."],
  ["Final pitches", "Present your working demo to the judges. Winners are announced at the end."],
];

export const FAQS = [
  ["Who can participate?", "Students and early professionals. Final eligibility rules will be on the registration page."],
  ["How big can a team be?", "Teams must have 2 to 4 members. Solo entries are not accepted."],
  ["What do we need to submit?", "A short abstract for the idea round, then a working prototype, code repository and a short pitch in the final round."],
  ["Can we bring our own idea?", "Yes. Choose Open Innovation and pitch your own problem and solution."],
  ["Will there be mentors?", "Yes. Mentor sessions run at kick-off and during the build sprint."],
  ["Is it online or in person?", "Idea submission is online. The final round is held in person at the venue."],
];

export const LINKS = [["about", "About"], ["domains", "Domains"], ["timeline", "Timeline"], ["qa", "Q&A"], ["sponsors", "Sponsors"]];

export const REGISTER_URL = "#register";
