type Theme = "dark" | "light" | "system";

interface Position {
	x: number;
	y: number;
}

interface Dimension {
	width: number;
	height: number;
}

interface Block extends Position {
	name: string;
}

type Tool = "hand" | "pencil" | "eraser";

interface Settings {
	grid: boolean;
}
