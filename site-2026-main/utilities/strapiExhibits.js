/**
 * Load exhibits from Strapi for judging (admin, exhibitor progress, judge route titles).
 * Uses NEXT_PUBLIC_STRAPI_URL when set, otherwise a default Strapi app host.
 */

const DEFAULT_STRAPI_BASE = "https://loved-vitality-4672033e09.strapiapp.com";

export function getStrapiBase() {
  return (process.env.NEXT_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_BASE).replace(/\/$/, "");
}

export function getStrapiKey() {
  return process.env.NEXT_PUBLIC_STRAPI_KEY || "";
}

function strapiHeaders() {
  const key = getStrapiKey();
  return {
    Accept: "application/json",
    ...(key ? { Authorization: `Bearer ${key}` } : {}),
  };
}

/** @param {Record<string, unknown>} entry raw Strapi list item */
export function normalizeStrapiExhibitItem(entry) {
  if (!entry || typeof entry !== "object") return null;

  if (entry.attributes && (entry.id != null || entry.documentId != null)) {
    const a = entry.attributes;
    const pick = (...keys) => {
      for (const k of keys) {
        const v = a[k];
        if (v != null && v !== "") return v;
      }
      return "";
    };
    const strapiInternalId = String(entry.documentId ?? entry.id ?? "").trim();
    const name = String(
      pick("Exhibit_Name", "exhibit_name", "title", "name") || ""
    ).trim();
    const numRaw = pick("Exhibit_Number", "exhibit_number");
    const exhibitNumber = numRaw != null && numRaw !== "" ? String(numRaw).trim() : "";
    const building = String(pick("Exhibit_Building", "exhibit_building") || "").trim();
    const loc = String(
      pick("Exhibit_Location", "exhibit_location", "location", "building_location") || ""
    ).trim();
    const location = [building, loc].filter(Boolean).join(" · ") || loc || building;
    const awardRaw = a.awardIds ?? a.award_ids ?? [];
    const awardIds = Array.isArray(awardRaw)
      ? awardRaw.map((s) => String(s).trim()).filter(Boolean)
      : [];
    if (!strapiInternalId && !exhibitNumber) return null;
    /** Firestore + judging URLs use exhibit number; fall back to Strapi id only if missing. */
    const docId = exhibitNumber || strapiInternalId;
    return {
      docId,
      strapiInternalId: strapiInternalId || undefined,
      exhibitName: name,
      name,
      exhibitNumber: exhibitNumber || docId,
      exhibitBuilding: building,
      location,
      awardIds,
    };
  }

  const strapiInternalId = String(entry.id ?? entry.documentId ?? "").trim();
  const name = String(entry.Exhibit_Name ?? entry.exhibit_name ?? entry.title ?? "").trim();
  const exhibitNumber = String(entry.Exhibit_Number ?? entry.exhibit_number ?? "").trim();
  const building = String(entry.Exhibit_Building ?? entry.exhibit_building ?? "").trim();
  const loc = String(
    entry.Exhibit_Location ?? entry.exhibit_location ?? entry.location ?? ""
  ).trim();
  const location = [building, loc].filter(Boolean).join(" · ") || loc || building;
  const awardIds = Array.isArray(entry.awardIds)
    ? entry.awardIds.map((s) => String(s).trim()).filter(Boolean)
    : [];
  if (!strapiInternalId && !exhibitNumber && !name) return null;
  const docId = exhibitNumber || strapiInternalId;
  return {
    docId,
    strapiInternalId: strapiInternalId || undefined,
    exhibitName: name,
    name,
    exhibitNumber: exhibitNumber || docId,
    exhibitBuilding: building,
    location,
    awardIds,
  };
}

export async function fetchStrapiExhibitsForJudging() {
  const base = getStrapiBase();
  const url = `${base}/api/exhibits?pagination[pageSize]=500&populate=Tags`;
  const res = await fetch(url, { headers: strapiHeaders() });
  if (!res.ok) throw new Error(`Strapi exhibits list ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json?.data) ? json.data : [];
  const out = [];
  for (const item of arr) {
    const n = normalizeStrapiExhibitItem(item);
    if (n) out.push(n);
  }
  out.sort((a, b) => (a.exhibitName || "").localeCompare(b.exhibitName || ""));
  return out;
}

async function fetchStrapiExhibitByDocumentId(strapiId) {
  const id = String(strapiId ?? "").trim();
  if (!id) return null;
  const base = getStrapiBase();
  const url = `${base}/api/exhibits/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: strapiHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Strapi exhibit ${res.status}`);
  const json = await res.json();
  const raw = json?.data;
  return normalizeStrapiExhibitItem(raw);
}

/** Try list filter by Exhibit_Number (judging key). */
async function fetchStrapiExhibitByExhibitNumber(exhibitNumber) {
  const raw = String(exhibitNumber ?? "").trim();
  if (!raw) return null;
  const base = getStrapiBase();
  const params = new URLSearchParams();
  params.set("pagination[pageSize]", "1");
  params.set("populate", "Tags");

  const tries = [];
  if (Number.isFinite(Number(raw)) && raw !== "") {
    tries.push(["filters[Exhibit_Number][$eq]", Number(raw)]);
    tries.push(["filters[exhibit_number][$eq]", Number(raw)]);
  }
  tries.push(["filters[Exhibit_Number][$eq]", raw]);
  tries.push(["filters[exhibit_number][$eq]", raw]);

  const seen = new Set();
  for (const [k, v] of tries) {
    const sig = `${k}=${v}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    const p = new URLSearchParams(params);
    p.set(k, String(v));
    const url = `${base}/api/exhibits?${p.toString()}`;
    const res = await fetch(url, { headers: strapiHeaders() });
    if (!res.ok) continue;
    const json = await res.json();
    const arr = json?.data;
    if (Array.isArray(arr) && arr[0]) return normalizeStrapiExhibitItem(arr[0]);
  }
  return null;
}

/**
 * Load one exhibit for judging UI. Resolves by Strapi EXHIBIT_NUMBER first, then by Strapi document id (legacy).
 */
export async function fetchStrapiExhibitById(exhibitKey) {
  const key = String(exhibitKey ?? "").trim();
  if (!key) return null;
  const byNum = await fetchStrapiExhibitByExhibitNumber(key);
  if (byNum) return byNum;
  return fetchStrapiExhibitByDocumentId(key);
}
