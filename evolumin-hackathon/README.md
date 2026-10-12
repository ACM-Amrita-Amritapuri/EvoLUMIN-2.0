# Evolumin Hackathon

React + Vite + Tailwind CSS site.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # preview the build
```

## Where to edit

- `src/data.js`: domains and problem statements, timeline steps (set `iso` to a real date and it shows), FAQ, countdown date (`EVENT`), side-nav sections.
- `src/components/`: one file per section (Hero, About, Problems, Chrono, Dates, QA, Sponsors, Footer, Intro, Nav).
- `src/index.css`: the full design (layout, parallax, stacking sections, cinematic effects). Tailwind is installed and configured (`tailwind.config.js` has the brand colours), so you can use utility classes in any component alongside it.
- `src/assets/logo.jpg` and `public/logo.jpg`: the logo.
- Contact details are in `src/components/Footer.jsx`.
