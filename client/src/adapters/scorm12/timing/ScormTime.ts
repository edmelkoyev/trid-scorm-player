export function parseScormTime(value = "00:00:00"): number {
  const [h, m, s] = value.split(":");
  return (
    Number(h) * 3600000 +
    Number(m) * 60000 +
    Number(parseFloat(s)) * 1000
  );
}

export function formatScormTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
