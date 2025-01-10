type Theme = "dark" | "light" | "system";

interface Position {
	x: number;
	y: number;
}

interface Dimension {
	width: number;
	height: number;
}

interface CanvasSize {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

interface Block extends Position {
	name: string;
}

type Tool = "hand" | "pencil" | "eraser" | "eyedropper" | "zoom";

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
		fallable?: boolean;
		creative?: boolean;
		tile_entity?: boolean;
		properties?: Record<string, string>;
	}
>;
