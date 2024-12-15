import { Graphics } from "@pixi/react";

interface Props {
	canvasSize: CanvasSize;
}

function CanvasBorder({ canvasSize }: Props) {
	return (
		<Graphics
			draw={(g) => {
				g.clear();
				g.lineStyle(2, 0xffffff, 0.25, 1);
				g.drawRect(canvasSize.minX * 16, canvasSize.minY * 16, (canvasSize.maxX - canvasSize.minX) * 16, (canvasSize.maxY - canvasSize.minY) * 16);
			}}
		/>
	);
}

export default CanvasBorder;
