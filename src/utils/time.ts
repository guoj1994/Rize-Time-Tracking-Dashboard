/** 9_660 -> "2 hr 41 min" */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  if (hours === 0 && minutes === 0) return `${total % 60} sec`;
  if (hours === 0) return `${minutes} min`;
  return `${hours} hr ${minutes} min`;
}

/** 9_660 -> "2h 41m" */
export function formatCompact(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

/** 3_725 -> "1:02:05" */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

/** 161 -> "2 hr 41 min" from minutes */
export function formatMinutes(minutes: number): string {
  return formatDuration(minutes * 60);
}

/** 540 -> "9:00 AM" */
export function formatMinuteOfDay(minuteOfDay: number): string {
  const hours24 = Math.floor(minuteOfDay / 60) % 24;
  const minutes = minuteOfDay % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function percent(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round(part / whole * 100);
}