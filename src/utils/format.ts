/** Thousands-separated integers. No currency symbol anywhere — coins are fictional. */
export function formatCoins(value: number): string {
  const n = Math.max(0, Math.round(value || 0));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatSigned(value: number): string {
  const n = Math.round(value || 0);
  if (n === 0) {
    return '0';
  }
  return (n > 0 ? '+' : '-') + formatCoins(Math.abs(n));
}

export function formatPercent(fraction: number): string {
  return Math.round((fraction || 0) * 100) + '%';
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Countdown "05H 12M" to the next local midnight. */
export function timeToMidnight(now: Date = new Date()): string {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const diff = Math.max(0, next.getTime() - now.getTime());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return String(h).padStart(2, '0') + 'H ' + String(m).padStart(2, '0') + 'M';
}

export const TABULAR = { fontVariant: ['tabular-nums' as const] };

/** RN typing wants a `${number}%` literal; this keeps the call sites clean. */
export function barWidth(ratio: number): { width: `${number}%`; height: '100%' } {
  const pct = Math.max(0, Math.min(1, ratio || 0)) * 100;
  return { width: `${Math.round(pct * 10) / 10}%`, height: '100%' };
}
