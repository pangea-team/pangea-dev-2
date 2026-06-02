export function deriveShareStatusMap(
  shareReqs: { trace_card_id: string | null; status: string }[],
): Map<string, 'accepted'> {
  const map = new Map<string, 'accepted'>()
  for (const req of shareReqs) {
    if (!req.trace_card_id) continue
    if (req.status === 'accepted') {
      map.set(req.trace_card_id, 'accepted')
    }
  }
  return map
}
