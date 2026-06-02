export function deriveShareStatusMap(
  shareReqs: { trace_card_id: string | null; status: string }[],
): Map<string, 'pending' | 'accepted'> {
  const map = new Map<string, 'pending' | 'accepted'>()
  for (const req of shareReqs) {
    if (!req.trace_card_id) continue
    const existing = map.get(req.trace_card_id)
    if (req.status === 'accepted') {
      map.set(req.trace_card_id, 'accepted')
    } else if (req.status === 'pending' && existing !== 'accepted') {
      map.set(req.trace_card_id, 'pending')
    }
  }
  return map
}
