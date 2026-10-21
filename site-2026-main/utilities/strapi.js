/**
 * Single place for the Strapi CMS connection (home schedule, Visitor View, judging).
 * Host: NEXT_PUBLIC_STRAPI_URL if set, otherwise DEFAULT_STRAPI_BASE below.
 * Key:  NEXT_PUBLIC_STRAPI_KEY (from .env locally / Vercel env vars in production).
 */

const DEFAULT_STRAPI_BASE = "https://loved-vitality-4672033e09.strapiapp.com";

export function getStrapiBase() {
  return (process.env.NEXT_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_BASE).replace(/\/$/, "");
}

export function getStrapiKey() {
  return process.env.NEXT_PUBLIC_STRAPI_KEY || "";
}

/** Full URL for a Strapi API path, e.g. strapiUrl("/api/events?...") */
export function strapiUrl(path) {
  return `${getStrapiBase()}${path}`;
}

/** SWR fetcher for the schedule and Visitor View lists. Failures are logged with a "[Strapi]" prefix. */
export async function strapiSwrFetcher(url) {
  let res;
  try {
    res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_KEY}`
      }
    });
  } catch (err) {
    console.error(`[Strapi] Could not reach ${getStrapiBase()} (server down, blocked, or offline):`, err);
    throw err;
  }
  if (!res.ok) {
    console.error(`[Strapi] ${res.status} from ${url} (401/403 usually means NEXT_PUBLIC_STRAPI_KEY is missing or wrong)`);
  }
  return res.json();
}
