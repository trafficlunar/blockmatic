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
	blockSelectorWindow: boolean;
	grid: boolean;
	canvasBorder: boolean;
}

interface DialogProps {
	close: () => void;
}

type BlockData = Record<
	string,
	{
		name: string;
		version: string;
		id: (string | number)[];
		color: number[];
		fallable?: boolean;
		creative?: boolean;
		tile_entity?: boolean;
		properties?: Record<string, string>;
	}
>;
