/**
 * Central site constants. The canonical origin can be overridden per
 * environment via NEXT_PUBLIC_SITE_URL (see .env.example); the fallback is the
 * production hostname.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reps.levostudio.dev"
).replace(/\/$/, "");

export const SITE_NAME = "Reps";
export const SITE_TITLE = "Reps — Minimal gym & lift tracker";
export const SITE_DESCRIPTION =
  "Reps is a minimalist, private, local iOS workout tracker. Log weight × reps, let the rest timer run, and leave — no account, no cloud, no tracking.";
export const PUBLISHER = "Levo Studio";

/** App Store link. Placeholder until the listing is live. */
export const APP_STORE_URL = "#";

export const GITHUB_APP_URL = "https://github.com/levo-studio/reps";
export const GITHUB_WEBSITE_URL = "https://github.com/levo-studio/reps-website";
