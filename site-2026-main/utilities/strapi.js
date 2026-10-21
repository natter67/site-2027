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

/** SWR fetcher for the schedule and Visitor View lists. */
export function strapiSwrFetcher(url) {
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_KEY}`
    }
  }).then((res) => res.json());
}
