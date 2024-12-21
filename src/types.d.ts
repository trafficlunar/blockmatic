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

type Tool = "hand" | "pencil" | "eraser" | "zoom";

interface Settings {
	grid: boolean;
	canvasBorder: boolean;
}

interface DialogProps {
	close: () => void;
}

