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
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
};