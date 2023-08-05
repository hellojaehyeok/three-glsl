export function lerp(start: number, end: number, time: number) {
  return start * (1 - time) + end * time;
}
