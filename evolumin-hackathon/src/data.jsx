export const ART = {
  space: <g><circle cx="100" cy="60" r="26"/><ellipse cx="100" cy="60" rx="64" ry="14" transform="rotate(-20 100 60)"/><circle cx="28" cy="26" r="2"/><circle cx="172" cy="100" r="2"/><circle cx="160" cy="20" r="3"/></g>,
  mind: <g><path d="M10 70H55L70 30L95 105L115 50L130 70H190"/><circle cx="100" cy="60" r="52" opacity=".4"/></g>,
  climate: <g><path d="M60 100C60 40 110 20 160 20C160 70 120 100 60 100Z"/><path d="M60 100L130 50"/><circle cx="40" cy="30" r="12" opacity=".5"/></g>,
  trust: <g><path d="M100 10L160 32V65C160 90 135 105 100 112C65 105 40 90 40 65V32Z"/><circle cx="100" cy="58" r="10"/><path d="M100 68V84"/></g>,
  access: <g><circle cx="100" cy="22" r="10"/><path d="M60 45H140M100 45V80M100 80L75 110M100 80L125 110"/><circle cx="100" cy="60" r="52" opacity=".4"/></g>,
  open: <g><circle cx="100" cy="48" r="28"/><path d="M88 80H112M91 90H109M100 8V0M60 20L52 12M140 20L148 12M40 48H28M160 48H172"/></g>,
};

export const Art = ({ id }) => <svg viewBox="0 0 200 120" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{ART[id]}</svg>;

// Tracks come from the brochure; the problem statements under each are illustrative prompts.
export const DOMAINS = [
  ["space", "Space, Astronomy & Frontier Technology", "Look up, then build for what is out there.", [["Satellite Data for Everyone", "Turn open satellite and astronomy datasets into tools that students and local communities can actually use."], ["Low-Cost Space Education", "Simulations, kits or apps that bring space science and frontier engineering to classrooms."]]],
  ["climate", "Disaster Management, Climate & Resilience", "Be ready before the next crisis.", [["Early Disaster Alerts", "Warn communities about floods, landslides or storms in time, using sensors or open data."], ["Relief Coordination", "Help responders match supplies, volunteers and needs during an emergency."]]],
  ["trust", "Trust, Identity & Decentralization", "Systems people can verify and rely on.", [["Verifiable Credentials", "Let people prove who they are or what they have achieved without exposing personal data."], ["Transparent Donations", "Let donors trace every contribution to its real-world impact."]]],
  ["access", "Accessibility & Inclusive Innovation", "Technology that leaves no one out.", [["Multilingual Voice Assistant", "Serve rural users in regional languages with low bandwidth."], ["Assistive Tools", "Help people with visual, hearing or motor impairments use everyday technology independently."]]],
  ["mind", "Mental Health & Human Wellbeing", "Support that is private, kind and early.", [["Stress and Burnout Companion", "A privacy-first tool that helps students notice and manage stress early."], ["Safe Peer Support", "Connect people to supportive communities and trained help, anonymously."]]],
  ["open", "Open Innovation", "Your idea, your rules.", [["Wildcard Challenge", "Pitch your own problem and solution. Impact and originality count the most."]]],
].map(([id, name, blurb, problems]) => ({ id, name, blurb, problems }));

export const TECH = ["Artificial Intelligence", "Cyber Security", "Web and App Development", "IoT / Edge Computing", "Blockchain", "Gamification"];

export const STAGES = [
  ["Ideation opens", "Form a team of 2 to 4, register and pick a track. Ideation runs online.", "Oct 28 to Nov 3", "Online"],
  ["Ideation closes", "Last day to submit your idea. Late entries cannot be accepted.", "28 Nov", "Online"],
  ["Evaluation", "Judges evaluate every submission from the ideation stage.", "10 Dec", "Online"],
  ["Results published", "Shortlisted teams are announced after evaluation.", "After evaluation", "Online"],
  ["Implementation", "Time to build your solution, with time given for teams to come to campus.", "Before the finale", "Your own pace"],
  ["Grand Finale", "A 36-hour offline hackathon on campus with mentors, judges and a final pitch.", "1st week of Feb", "On campus"],
];

export const HIGHLIGHTS = ["Guest speakers from the industry", "Networking area", "Goodies", "Attractive cash prizes", "A chance to work with the research team of Amrita Vishwa Vidyapeetham"];

export const GOALS = [
  ["Innovation and creativity", "Challenge students to build bold solutions to real-world problems."],
  ["Skill development", "Grow technical and soft skills through hands-on work and mentorship from industry experts."],
  ["Social impact", "Inspire solutions that help society, in areas like agriculture, healthcare and sustainability."],
  ["Collaboration and networking", "Connect students from different backgrounds with professionals, academics and potential employers."],
  ["Practical application", "Bridge theory and practice by putting what students learn to work on real scenarios."],
  ["Recognition and opportunities", "Reward outstanding work and open doors to internships, incubation and project funding."],
];

export const EMAIL = "evolumin2.0@gmail.com";

export const FAQS = [
  ["Who can participate?", "College and high school students from across the country are invited. Final eligibility rules will be on the registration page."],
  ["How big can a team be?", "Teams must have 2 to 4 members. Solo entries are not accepted."],
  ["What do we need to submit?", "A short abstract for the ideation round, then a working prototype, code repository and a short pitch at the grand finale."],
  ["Can we bring our own idea?", "Yes. Choose Open Innovation and pitch your own problem and solution."],
  ["Will there be mentors?", "Yes. Expert mentors, workshops and resources help you refine your idea and build."],
  ["Is it online or in person?", "Phase 1 (ideation and evaluation) is online. Phase 2, the 36-hour grand finale, is offline on the Amritapuri campus in the first week of February."],
  ["What can we win?", "Attractive cash prizes (Evolumin 1.0 had a 5.5 lakh prize pool), a chance to work with Amrita's research team, and opportunities such as internships, incubation and potential project funding."],
];

export const LINKS = [["about", "About"], ["domains", "Tracks"], ["timeline", "Timeline"], ["qa", "Q&A"]];

export const REGISTER_URL = "#register";
