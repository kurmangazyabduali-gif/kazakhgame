export function calculateTeaFillAmount(durationMs: number): number {
  return Math.max(0, Math.min(100, Math.round((durationMs / 2200) * 100)))
}

export function isRespectfulTeaAmount(amount: number): boolean {
  return amount >= 35 && amount <= 75
}
