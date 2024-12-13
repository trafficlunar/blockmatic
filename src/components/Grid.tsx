import { Graphics } from "@pixi/react";

interface Props {
	stageSize: Dimension;
	coords: Position;
	scale: number;
}

function Grid({ stageSize, coords, scale }: Props) {
	return (
		<Graphics
			draw={(g) => {
				g.clear();
				g.lineStyle(1, 0xffffff, 0.1);

				const tileSize = 16 * scale;

				for (let x = coords.x % tileSize; x < stageSize.width; x += tileSize) {
					g.moveTo(x, 0);
					g.lineTo(x, stageSize.height);
				}

				for (let y = coords.y % tileSize; y < stageSize.height; y += tileSize) {
					g.moveTo(0, y);
					g.lineTo(stageSize.width, y);
				}
			}}
		/>
	);
}

export default Grid;
