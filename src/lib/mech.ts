import type { IconName } from '../components/Icon';

/** Maintenance / machinery terms → icon. First match wins. */
const RULES: [RegExp, IconName][] = [
  [/hydraul|pneumat|fluid|pump/i, 'drop'],
  [/weld|fabricat|braz|cut/i, 'flame'],
  [/plc|electric|wiring|motor|control|sensor/i, 'bolt'],
  [/cnc|machin|lathe|mill|turn/i, 'cog'],
  [/robot|automat|cell/i, 'robot'],
  [/align|laser|precision|measure|calib|blueprint|drawing/i, 'ruler'],
  [/vibration|diagnos|condition|troubleshoot|analys/i, 'activity'],
  [/preventive|maintenance|repair|overhaul|gearbox|bearing|rebuild/i, 'wrench'],
  [/safety|lockout|tagout|osha|loto|guard/i, 'shield'],
  [/conveyor|line|plant|production|install/i, 'factory'],
  [/cmms|sap|software|kanban|spares|inventory/i, 'layersRepo'],
  [/team|lead|train|mentor|apprentic/i, 'users'],
];
const FALLBACK: IconName[] = ['wrench', 'cog', 'bolt', 'ruler', 'factory', 'shield'];

export function iconFor(text: string, i = 0): IconName {
  return RULES.find(([re]) => re.test(text))?.[1] ?? FALLBACK[i % FALLBACK.length];
}

/** Picks n different icons for a row of items. */
export function distinctIcons(texts: string[]): IconName[] {
  const out: IconName[] = [];
  texts.forEach((t, i) => {
    const pick = iconFor(t, i);
    out.push(out.includes(pick) ? FALLBACK.find((f) => !out.includes(f)) ?? pick : pick);
  });
  return out;
}

export function splitHeadline(headline: string): [string, string] {
  const [role, ...rest] = headline.split(/\s*[|·•]\s*|\s+[—–]\s+/);
  return [role?.trim() || headline, rest.join(' · ').trim()];
}

/** First figure in a sentence ("Saved $280K…" → $ 280 K) so it can count up; bare years are dates, not results. */
export function leadNumber(text: string): { pre: string; n: number; post: string } | null {
  const m = text.match(/([$€£]?)(\d[\d,]*(?:\.\d+)?)\s?(%|[KMB]\b|x\b)?/);
  if (!m) return null;
  if (!m[1] && !m[3] && /^(19|20)\d\d$/.test(m[2])) return null;
  return { pre: m[1], n: parseFloat(m[2].replace(/,/g, '')), post: m[3] ?? '' };
}

/** Two short lines for a big statement headline: split after a full stop if there is one, else balance by length. */
export function statement(text: string): [string, string] {
  const t = text.trim().replace(/\.$/, '');
  const stop = t.indexOf('. ');
  if (stop > 0) return [t.slice(0, stop + 1), t.slice(stop + 2) + '.'];
  const words = t.split(/\s+/);
  if (words.length < 3) return [t + '.', ''];
  let best = 1;
  let diff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (d < diff) {
      diff = d;
      best = i;
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ') + '.'];
}
