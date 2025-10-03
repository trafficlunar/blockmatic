interface Props {
	canvasSize: BoundingBox;
	isDark: boolean;
}

function CanvasBorder({ canvasSize, isDark }: Props) {
	return (
		<pixiGraphics
			draw={(g) => {
				g.clear();
				g.rect(canvasSize.minX * 16, canvasSize.minY * 16, (canvasSize.maxX - canvasSize.minX) * 16, (canvasSize.maxY - canvasSize.minY) * 16);
				g.stroke({ width: 2, color: isDark ? 0xffffff : 0x000000, alpha: 0.25, alignment: 0 });
			}}
		/>
	);
}

export default CanvasBorder;
