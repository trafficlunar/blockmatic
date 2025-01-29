import { useContext, useEffect, useState } from "react";

import { CanvasContext } from "@/context/Canvas";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SetCoords({ close, registerSubmit, dialogKeyHandler }: DialogProps) {
	const { stageSize, coords, scale, setCoords } = useContext(CanvasContext);

	const [newTilemapCoords, setNewTilemapCoords] = useState(coords);

	const onSubmit = () => {
		// Get center of screen
		const halfWidth = stageSize.width / 2;
		const halfHeight = stageSize.height / 2;

		// Calculate coordinate offset to show the center of the block in the middle of the screen
		const offsetX = halfWidth - (16 / 2) * scale;
		const offsetY = halfHeight - (16 / 2) * scale;

		// Multiply by -16 to reverse the direction
		setCoords({
			x: newTilemapCoords.x * -16 * scale + offsetX,
			y: newTilemapCoords.y * -16 * scale + offsetY,
		});

		close();
	};

	registerSubmit(onSubmit);

	// Sets the current coordinates when the dialog is first opened
	useEffect(() => {
		// Get center of screen
		const halfWidth = stageSize.width / 2;
		const halfHeight = stageSize.height / 2;

		// Calculate coordinate offset
		const offsetX = halfWidth + 16 / 2;
		const offsetY = halfHeight + 16 / 2;

		setNewTilemapCoords({
			x: Math.floor((coords.x - offsetX) / -16 / scale),
			y: Math.floor((coords.y - offsetY) / -16 / scale),
		});
	}, []);

	return (
		<DialogContent onKeyDown={dialogKeyHandler}>
			<DialogHeader>
				<DialogTitle>Set Coordinates</DialogTitle>
				<DialogDescription>Set your coordinates to a particular position</DialogDescription>
			</DialogHeader>

			<div className="grid grid-cols-2 gap-2">
				<div>
					<Label htmlFor="x">X</Label>
					<Input
						type="number"
						id="x"
						placeholder="X"
						value={newTilemapCoords.x}
						onChange={(e) => setNewTilemapCoords((prev) => ({ ...prev, x: parseInt(e.target.value) }))}
						autoFocus
					/>
				</div>

				<div>
					<Label htmlFor="y">Y</Label>
					<Input
						type="number"
						id="y"
						placeholder="Y"
						value={newTilemapCoords.y}
						onChange={(e) => setNewTilemapCoords((prev) => ({ ...prev, y: parseInt(e.target.value) }))}
					/>
				</div>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={close}>
					Cancel
				</Button>
				<Button type="submit" onClick={onSubmit}>
					Submit
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default SetCoords;
