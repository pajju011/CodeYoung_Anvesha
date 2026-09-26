// Common timezone configurations for global scheduling
export const TIMEZONE_LIST = [
  {
    id: 'America/New_York',
    label: 'Eastern Time (US & Canada)',
    city: 'New York',
    abbr: 'EDT',
    utcOffset: '-04:00',
    offsetMinutes: -240,
    region: 'North America',
  },
  {
    id: 'America/Chicago',
    label: 'Central Time (US & Canada)',
    city: 'Chicago',
    abbr: 'CDT',
    utcOffset: '-05:00',
    offsetMinutes: -300,
    region: 'North America',
  },
  {
    id: 'America/Denver',
    label: 'Mountain Time (US & Canada)',
    city: 'Denver',
    abbr: 'MDT',
    utcOffset: '-06:00',
    offsetMinutes: -360,
    region: 'North America',
  },
  {
    id: 'America/Los_Angeles',
    label: 'Pacific Time (US & Canada)',
    city: 'Los Angeles / SF',
    abbr: 'PDT',
    utcOffset: '-07:00',
    offsetMinutes: -420,
    region: 'North America',
  },
  {
    id: 'Europe/London',
    label: 'Greenwich Mean Time / BST',
    city: 'London',
    abbr: 'BST',
    utcOffset: '+01:00',
    offsetMinutes: 60,
    region: 'Europe',
  },
  {
    id: 'Europe/Berlin',
    label: 'Central European Time',
    city: 'Berlin / Paris',
    abbr: 'CEST',
    utcOffset: '+02:00',
    offsetMinutes: 120,
    region: 'Europe',
  },
  {
    id: 'Asia/Dubai',
    label: 'Gulf Standard Time',
    city: 'Dubai',
    abbr: 'GST',
    utcOffset: '+04:00',
    offsetMinutes: 240,
    region: 'Middle East',
  },
  {
    id: 'Asia/Kolkata',
    label: 'India Standard Time',
    city: 'New Delhi / Bengaluru',
    abbr: 'IST',
    utcOffset: '+05:30',
    offsetMinutes: 330,
    region: 'Asia',
  },
  {
    id: 'Asia/Singapore',
    label: 'Singapore Standard Time',
    city: 'Singapore',
    abbr: 'SGT',
    utcOffset: '+08:00',
    offsetMinutes: 480,
    region: 'Asia',
  },
  {
    id: 'Asia/Tokyo',
    label: 'Japan Standard Time',
    city: 'Tokyo',
    abbr: 'JST',
    utcOffset: '+09:00',
    offsetMinutes: 540,
    region: 'Asia',
  },
  {
    id: 'Australia/Sydney',
    label: 'Australian Eastern Time',
    city: 'Sydney / Melbourne',
    abbr: 'AEST',
    utcOffset: '+10:00',
    offsetMinutes: 600,
    region: 'Australia',
  },
  {
    id: 'Pacific/Auckland',
    label: 'New Zealand Standard Time',
    city: 'Auckland',
    abbr: 'NZST',
    utcOffset: '+12:00',
    offsetMinutes: 720,
    region: 'Pacific',
  },
];

/**
 * Detects the user's browser timezone or falls back to India Standard Time or Eastern Time
 */
export function detectUserTimezone() {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) {
      const match = TIMEZONE_LIST.find((tz) => tz.id === detected);
      if (match) return match.id;
      // If detected is not directly in curated list, check if offset matches
      const now = new Date();
      const offsetMinutes = -now.getTimezoneOffset();
      const byOffset = TIMEZONE_LIST.find((tz) => tz.offsetMinutes === offsetMinutes);
      if (byOffset) return byOffset.id;
      return detected;
    }
  } catch {
    // Fallback if Intl fails
  }
  return 'America/New_York';
}

export function getTimezoneMeta(tzId) {
  const match = TIMEZONE_LIST.find((tz) => tz.id === tzId);
  if (match) return match;
  return {
    id: tzId,
    label: tzId.replace(/_/g, ' '),
    city: tzId.split('/').pop()?.replace(/_/g, ' ') || tzId,
    abbr: 'Local',
    utcOffset: '',
    offsetMinutes: 0,
    region: 'Other',
  };
}
