const DEFAULT_RATE = 180;

const RATE_KEYWORDS: Record<string, number> = {
  'x-slow': 90,
  slow: 120,
  medium: 180,
  fast: 270,
  'x-fast': 360,
};

function parseSsmlRate(value: string): number {
  if (value in RATE_KEYWORDS) return RATE_KEYWORDS[value];
  if (value.endsWith('%'))
    return Math.round(DEFAULT_RATE * (parseFloat(value) / 100));
  const multiplier = parseFloat(value);
  return isNaN(multiplier)
    ? DEFAULT_RATE
    : Math.round(DEFAULT_RATE * multiplier);
}

function unescapeEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export function ssmlToSay(input: string): string {
  if (!input.includes('<')) return unescapeEntities(input);

  return unescapeEntities(
    input
      .replace(/<speak[^>]*>/g, '')
      .replace(/<\/speak>/g, '')
      .replace(/<break\s+time="(\d+)ms"\s*\/?>/g, (_, ms) => `[[slnc ${ms}]]`)
      .replace(
        /<break\s+time="(\d+)s"\s*\/?>/g,
        (_, s) => `[[slnc ${parseInt(s) * 1000}]]`,
      )
      .replace(
        /<emphasis\s+level="(?:reduced|none)"[^>]*>(.*?)<\/emphasis>/gs,
        (_, text) => text,
      )
      .replace(
        /<emphasis(?:\s+level="(?:strong|moderate)")?[^>]*>(.*?)<\/emphasis>/gs,
        (_, text) => `[[emph +]]${text}[[emph -]]`,
      )
      .replace(
        /<prosody[^>]*\srate="([^"]+)"[^>]*>(.*?)<\/prosody>/gs,
        (_, rate, text) =>
          `[[rate ${parseSsmlRate(rate)}]]${text}[[rate ${DEFAULT_RATE}]]`,
      )
      .replace(/<[^>]+>/g, '')
      .trim(),
  );
}
