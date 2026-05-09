export function parseMoney(value: string | undefined): number {
  return parseFloat(value ?? '0');
}

export function formatPercent(percent: number | null): string | null {
  if (percent === null) return null;
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

export function abbreviate(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}
