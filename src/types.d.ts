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

type Tool = "hand" | "move" | "rectangle-select" | "lasso" | "magic-wand" | "pencil" | "eraser" | "paint-bucket" | "eyedropper" | "zoom";

interface Settings {
	grid: boolean;
	canvasBorder: boolean;
	historyPanel: boolean;
	colorPicker: boolean;
	blockReplacer: boolean;
	toolSettings: boolean;
	blockSelector: boolean;
}

interface DialogProps {
	close: () => void;
	registerSubmit: (fn: () => void) => void;
	dialogKeyHandler: (e: React.KeyboardEvent) => void;
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

interface HistoryEntry {
	name: string;
	apply: () => void;
	revert: () => void;
}
