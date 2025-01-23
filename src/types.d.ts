type Theme = "dark" | "light" | "system";

interface Position {
	x: number;
	y: number;
}

interface Dimension {
	width: number;
	height: number;
}

interface BoundingBox {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

interface Block extends Position {
	name: string;
}

type CoordinateArray = [number, number][];

type Tool = "hand" | "move" | "rectangle-select" | "lasso" | "magic-wand" | "pencil" | "eraser" | "eyedropper" | "zoom";

interface Settings {
	grid: boolean;
	canvasBorder: boolean;
	colorPicker: boolean;
	blockReplacer: boolean;
	radiusChanger: boolean;
	blockSelector: boolean;
}

interface DialogProps {
	close: () => void;
}

type BlockData = Record<
	string,
	{
		name: string;
		version: number;
		id: string;
		color: number[];
		falling?: boolean;
		creative?: boolean;
		tile_entity?: boolean;
		properties?: Record<string, string>;
	}
>;
