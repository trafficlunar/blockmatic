import { useContext, useEffect, useState } from "react";
import { Container, Sprite, Stage } from "@pixi/react";

import { CanvasContext } from "@/context/Canvas";
import { ToolContext } from "@/context/Tool";
import { TexturesContext } from "@/context/Textures";

import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

function Replace() {
	const { setBlocks } = useContext(CanvasContext);
	const { selectedBlock, tool, setTool } = useContext(ToolContext);
	const { missingTexture, textures } = useContext(TexturesContext);

	const [oldTool, setOldTool] = useState<Tool>("hand");
	const [waitingId, setWaitingId] = useState<number | null>(null);
	const [block1, setBlock1] = useState<string>("");
	const [block2, setBlock2] = useState<string>("");

	const onClickBlockButton = (id: number) => {
		setWaitingId(id);
		setOldTool(tool);
		setTool("eyedropper");
	};

	const onClickReplace = () => {
		setBlocks((prevBlocks) => prevBlocks.map((block) => (block.name === block1 ? { ...block, name: block2 } : block)));
	};

	useEffect(() => {
		if (!waitingId) return;

		if (waitingId == 1) {
			setBlock1(selectedBlock);
		} else if (waitingId == 2) {
			setBlock2(selectedBlock);
		}

		setTool(oldTool);
		setWaitingId(null);
	}, [selectedBlock]);

	return (
		<div className="grid grid-cols-2 items-center gap-2">
			<Label htmlFor="radius">Block 1</Label>
			<button
				onClick={() => onClickBlockButton(1)}
				className="h-10 rounded-md border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 flex justify-center items-center"
			>
				<Stage width={32} height={32} options={{ backgroundAlpha: 0 }}>
					<Container>
						<Sprite texture={textures[`${block1}.png`] ?? missingTexture} scale={2} />
					</Container>
				</Stage>
			</button>

			<Label htmlFor="radius">Block 2</Label>
			<button
				onClick={() => onClickBlockButton(2)}
				className="h-10 rounded-md border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 flex justify-center items-center"
			>
				<Stage width={32} height={32} options={{ backgroundAlpha: 0 }}>
					<Container>
						<Sprite texture={textures[`${block2}.png`] ?? missingTexture} scale={2} />
					</Container>
				</Stage>
			</button>

			<br />
			<Button variant="outline" onClick={onClickReplace} className="h-8">
				Replace
			</Button>
		</div>
	);
}

export default Replace;
