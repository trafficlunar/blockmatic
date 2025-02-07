import { useContext } from "react";

import { CanvasContext } from "@/context/Canvas";
import { HistoryContext } from "@/context/History";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ClearBlocks({ close }: DialogProps) {
	const { setBlocks } = useContext(CanvasContext);
	const { addHistory } = useContext(HistoryContext);

	const onSubmit = () => {
		const clearedBlocks = [{ name: "bedrock", x: 0, y: 0 }];
		setBlocks((prev) => {
			addHistory(
				"Clear All",
				() => setBlocks(clearedBlocks),
				() => setBlocks(prev)
			);
			return clearedBlocks;
		});

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
