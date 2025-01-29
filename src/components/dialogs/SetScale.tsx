import { useContext, useState } from "react";

import { CanvasContext } from "@/context/Canvas";

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SetScale({ close, registerSubmit, dialogKeyHandler }: DialogProps) {
	const { scale, setScale } = useContext(CanvasContext);

	const [newScale, setNewScale] = useState(scale * 100);

	const onSubmit = () => {
		setScale(newScale / 100);
		close();
	};

	registerSubmit(onSubmit);

	return (
		<DialogContent onKeyDown={dialogKeyHandler}>
			<DialogHeader>
				<DialogTitle>Set Scale</DialogTitle>
				<DialogDescription>Set your scale to a particular percentage</DialogDescription>
			</DialogHeader>

			<Input type="number" value={newScale} onChange={(e) => setNewScale(parseInt(e.target.value))} autoFocus />

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

export default SetScale;
