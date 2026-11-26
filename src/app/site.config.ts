// Prefix a file in public/ with the site's base path, so links work both locally ("/")
// and on GitHub Pages ("/MyPortfolio/").
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

// Edit the values below to update personal details across the whole site.
// Anything marked TODO is still a placeholder from the original design.

export const EMAIL = "23045361@myrp.edu.sg";
export const GITHUB_URL = "https://github.com/vincent240701";
export const LINKEDIN_URL = "https://www.linkedin.com/in/vincent-then-a9253a377";
export const RESUME_URL = asset("resume.pdf");
export const PHOTO_URL = ""; // TODO: e.g. "/photo.jpg" (file in public/); grey placeholder while empty

export const STUDY_YEAR = "2nd";
export const EDUCATION_YEARS = "2025 – Present";

// Optional: a Formspree/Web3Forms-style endpoint. Set VITE_CONTACT_ENDPOINT in .env
// to send messages directly; without it the form opens the visitor's email app.
export const CONTACT_ENDPOINT: string = import.meta.env.VITE_CONTACT_ENDPOINT ?? "";
