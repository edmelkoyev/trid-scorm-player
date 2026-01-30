export function formatScormTime(ms: number): string {
  if (typeof ms !== 'number' || ms < 0 || !Number.isFinite(ms)) {
    throw new Error('Milliseconds must be a non-negative finite number');
  }
  const roundedMs = Math.round(ms);

  const totalSeconds = Math.floor(roundedMs / 1000);
  const milliseconds = roundedMs % 1000;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = String(hours).padStart(4, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  if (milliseconds > 0) {
    let msStr = String(milliseconds).padStart(3, '0');
    while (msStr.length > 1 && msStr.endsWith('0')) {
      msStr = msStr.slice(0, -1);
    }
    return `${hoursStr}:${minutesStr}:${secondsStr}.${msStr}`;
  }
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}
