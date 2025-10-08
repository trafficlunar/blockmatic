import { useContext, useEffect, useState } from "react";

import { CanvasContext } from "@/context/Canvas";
import { HistoryContext } from "@/context/History";
import { SelectionContext } from "@/context/Selection";
import { ToolContext } from "@/context/Tool";
import { TexturesContext } from "@/context/Textures";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useTextures } from "@/hooks/useTextures";
import { Application } from "@pixi/react";

function Replace() {
	const { version, setBlocks } = useContext(CanvasContext);
	const { addHistory } = useContext(HistoryContext);
	const { isInSelection } = useContext(SelectionContext);
	const { selectedBlock, tool, setTool } = useContext(ToolContext);
	const { missingTexture } = useContext(TexturesContext);

	const textures = useTextures(version);

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
		// If block2 name is air, delete the block instead.
		setBlocks((prev) => {
			const oldBlocks = [...prev];

			const replacedBlocks = prev
				.map((block) => {
					if (isInSelection(block.x, block.y)) {
						if (block.name === block1) {
							// If block2 is air, return null
							// If not, change the block name
							return block2 === "air" ? null : { ...block, name: block2 };
						}
					}
					return block;
				})
				// Remove all blocks that are null
				.filter((block) => block !== null);

			addHistory(
				"Replace",
				() => setBlocks(replacedBlocks),
				() => setBlocks(oldBlocks)
			);
			return replacedBlocks;
		});
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
				className="h-10 rounded-md cursor-pointer border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 flex justify-center items-center"
			>
				<Application width={32} height={32} backgroundAlpha={0}>
					<pixiContainer>
						<pixiSprite texture={textures[block1] ?? missingTexture} scale={2} />
					</pixiContainer>
				</Application>
			</button>

			<Label htmlFor="radius">Block 2</Label>
			<button
				onClick={() => onClickBlockButton(2)}
				className="h-10 rounded-md cursor-pointer border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 flex justify-center items-center"
			>
				<Application width={32} height={32} backgroundAlpha={0}>
					<pixiContainer>
						<pixiSprite texture={textures[block2] ?? missingTexture} scale={2} />
					</pixiContainer>
				</Application>
			</button>

			<br />
			<Button variant="outline" onClick={onClickReplace} className="h-8">
				Replace
			</Button>
		</div>
	);
}

export default Replace;
