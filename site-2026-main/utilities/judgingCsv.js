import { AWARDS, awardLabelById } from "@utilities/awards";

function normHeader(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Map normalized header → canonical key */
const HEADER_KEYS = [
  ["group #", "group", "group number", "judging group", "group id"],
  ["expected time", "time", "scheduled time"],
  ["award", "awards", "award name", "award names", "award(s)"],
  ["exhibit #", "exhibit number", "exhibit id", "exhibit no"],
  ["exhibit name", "name", "title"],
];

function headerToKey(cell) {
  const n = normHeader(cell);
  for (let idx = 0; idx < HEADER_KEYS.length; idx++) {
    const variants = HEADER_KEYS[idx];
    if (!variants.includes(n)) continue;
    if (idx === 0) return "groupId";
    if (idx === 1) return "scheduledTime";
    if (idx === 2) return "awardsRaw";
    if (idx === 3) return "exhibitNum";
    if (idx === 4) return "exhibitName";
  }
  if (n.includes("group") && (n.includes("#") || n.includes("number"))) return "groupId";
  if (n.includes("award")) return "awardsRaw";
  if (n.includes("exhibit") && n.includes("#")) return "exhibitNum";
  if (n.includes("exhibit") && n.includes("name")) return "exhibitName";
  if (n.includes("expected") || n === "time") return "scheduledTime";
  return null;
}

function splitAwardTokens(raw) {
  return String(raw ?? "")
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildAwardAliasMap() {
  const m = new Map();
  for (const a of AWARDS) {
    m.set(normHeader(a.id), a.id);
    m.set(normHeader(a.label), a.id);
    const short = String(a.label).replace(/\s+award\s*$/i, "").trim();
    if (short) m.set(normHeader(short), a.id);
  }
  return m;
}

const AWARD_ALIASES = buildAwardAliasMap();

export function resolveAwardIdsFromCell(raw) {
  const tokens = splitAwardTokens(raw);
  const ids = [];
  for (const t of tokens) {
    const key = normHeader(t);
    const id = AWARD_ALIASES.get(key);
    if (id) ids.push(id);
  }
  return Array.from(new Set(ids));
}

export function resolveExhibitId(exhibits, exhibitNumRaw, exhibitNameRaw) {
  const num = String(exhibitNumRaw ?? "").trim();
  const nameGuess = String(exhibitNameRaw ?? "").trim();

  if (num) {
    const byId = exhibits.find((ex) => String(ex.docId ?? "").trim() === num);
    if (byId) return byId.docId;
    const byField = exhibits.find((ex) => {
      const raw = ex.exhibitNumber ?? ex.exhibitNum ?? ex.tableNumber ?? ex.EXHIBIT_NUMBER;
      return String(raw ?? "").trim() === num;
    });
    if (byField) return byField.docId;
  }

  if (nameGuess) {
    const ng = normHeader(nameGuess);
    const exact = exhibits.find((ex) => normHeader(ex.exhibitName || ex.name) === ng);
    if (exact) return exact.docId;
    const loose = exhibits.find((ex) => normHeader(ex.exhibitName || ex.name).includes(ng));
    if (loose) return loose.docId;
  }

  return null;
}

/**
 * Parse CSV text into normalized rows. Does not write Firestore.
 * @returns {{ rows: Array<{groupId:string, scheduledTime:string, awardIds:string[], exhibitId:string}>, errors: string[] }}
 */
export function parseJudgingScheduleCsv(csvText, exhibits) {
  const errors = [];
  const rows = [];
  const lines = String(csvText ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    errors.push("CSV needs a header row and at least one data row.");
    return { rows, errors };
  }

  function parseLine(line) {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        q = !q;
        continue;
      }
      if (!q && c === ",") {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += c;
    }
    out.push(cur.trim());
    return out;
  }

  const headerCells = parseLine(lines[0]);
  const colMap = [];
  headerCells.forEach((h, i) => {
    const key = headerToKey(h);
    colMap[i] = key;
  });

  if (!colMap.includes("groupId")) errors.push('Missing a "group #"-style column.');
  if (!colMap.includes("exhibitNum")) {
    errors.push('Missing an "exhibit #"-style column (exhibit name alone is not used for import).');
  }
  if (errors.length) return { rows, errors };

  /** One visit # per CSV row for the group; every award on that row shares it (mixed-award visits). */
  const visitCounterByGroup = new Map();

  for (let li = 1; li < lines.length; li++) {
    const cells = parseLine(lines[li]);
    const rec = {};
    cells.forEach((cell, i) => {
      const k = colMap[i];
      if (k) rec[k] = cell;
    });

    const groupId = String(rec.groupId ?? "").trim();
    if (!groupId) {
      errors.push(`Row ${li + 1}: empty group.`);
      continue;
    }
    const scheduledTime = String(rec.scheduledTime ?? "").trim();
    const awardIds = resolveAwardIdsFromCell(rec.awardsRaw ?? "");
    if (!awardIds.length) {
      errors.push(`Row ${li + 1}: could not resolve award(s) "${rec.awardsRaw}".`);
      continue;
    }
    const exhibitNum = String(rec.exhibitNum ?? "").trim();
    if (!exhibitNum) {
      errors.push(`Row ${li + 1}: missing exhibit #.`);
      continue;
    }
    const exhibitId = resolveExhibitId(exhibits, exhibitNum, rec.exhibitName);
    if (!exhibitId) {
      errors.push(
        `Row ${li + 1}: no exhibit loaded from Strapi matches exhibit # "${exhibitNum}".`
      );
      continue;
    }

    const visitNum = (visitCounterByGroup.get(groupId) || 0) + 1;
    visitCounterByGroup.set(groupId, visitNum);

    for (const awardId of awardIds) {
      rows.push({
        groupId,
        scheduledTime,
        awardId,
        awardLabel: awardLabelById(awardId),
        exhibitId,
        stopOrder: visitNum,
      });
    }
  }

  rows.sort((a, b) => {
    if (a.groupId !== b.groupId) return a.groupId.localeCompare(b.groupId);
    if (a.stopOrder !== b.stopOrder) return a.stopOrder - b.stopOrder;
    return a.awardId.localeCompare(b.awardId);
  });

  return { rows, errors };
}
