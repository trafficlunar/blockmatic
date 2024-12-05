interface Position {
    x: number;
    y: number
}

interface Block extends Position {
    name: string;
}

type Tool = "hand" | "pencil" | "eraser";