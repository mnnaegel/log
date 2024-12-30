export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const pad = (num: number): string => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
};

export const formatElapsedTime = (start: number, end: number): string => {
  return formatDuration(end - start);
};

export const minutesToMs = (minutes: number): number => {
  return minutes * 60 * 1000;
};

export const formatTimeDiff = (actualMs: number, estimateMs: number): string => {
  const diff = actualMs - estimateMs;
  const prefix = diff >= 0 ? '+' : '-';
  return prefix + formatDuration(Math.abs(diff));
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;
};