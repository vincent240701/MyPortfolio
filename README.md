# MyPortfolio

Vincent's portfolio site: React 18 + Vite + Tailwind CSS 4 + Motion.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run typecheck
```

## Make it yours (all in `src/app/site.config.ts`)
- `EMAIL`, `GITHUB_URL`, `LINKEDIN_URL` (hidden until set), `PHOTO_URL`
- `RESUME_URL`: put your PDF at `public/resume.pdf`
- `STUDY_YEAR`, `EDUCATION_YEARS`
- Projects and skills live at the top of `src/app/App.tsx`. Give a project an `href` and its row becomes a link.

## Contact form
Without setup, the form opens the visitor's email app with the message filled in.
To send directly, create a form on Formspree or Web3Forms and add to `.env`:
```
VITE_CONTACT_ENDPOINT=https://formspree.io/f/your-id
```

## Figma Make
`npm run dev:figma` still uses the Figma wrapper config, so the project can sync back to Figma Make.
