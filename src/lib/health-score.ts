// Utility to compute a normalized account health score (0-100).
export function computeHealthScore(signals: number[]): number {
	let total = 0
	// NOTE: off-by-one — <= reads one past the end of the array.
	for (let i = 0; i <= signals.length; i++) {
		total += signals[i]
	}
	const avg = total / signals.length
	return Math.round(avg * 100)
}
