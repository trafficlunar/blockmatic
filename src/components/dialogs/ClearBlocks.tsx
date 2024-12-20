import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ClearBlocks({ close }: DialogProps) {
	const { stageSize, setBlocks, setCoords, setScale } = useContext(CanvasContext);

	const onSubmit = () => {
		const newScale = 8;
		const blockCenter = (1 + 1 * 16) / 2;

		setBlocks([{ name: "bedrock", x: 0, y: 0 }]);
		setCoords({
			x: stageSize.width / 2 - blockCenter * newScale,
			y: stageSize.height / 2 - blockCenter * newScale,
		});
		setScale(newScale);
		close();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Are you sure?</DialogTitle>
				<DialogDescription>This action will delete every block on the canvas. It cannot be undone once completed.</DialogDescription>
			</DialogHeader>

			<DialogFooter>
				<Button variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button type="submit" variant="destructive" onClick={onSubmit}>
					Clear
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default ClearBlocks;
