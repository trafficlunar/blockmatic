export function interpolate(radius: number, position0: Position, position1: Position): Position[] {
	const dx = position1.x - position0.x;
	const dy = position1.y - position0.y;
	const steps = Math.max(Math.abs(dx), Math.abs(dy));

	const positions: Position[] = [];

	for (let i = 0; i <= steps; i++) {
		const x = Math.round(position0.x + (dx * i) / steps);
		const y = Math.round(position0.y + (dy * i) / steps);

		for (let rx = 0; rx < radius; rx++) {
			for (let ry = 0; ry < radius; ry++) {
				positions.push({ x: x + rx, y: y + ry });
			}
		}
	}

	return positions;
}
