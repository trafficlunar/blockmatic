import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function OpenImage() {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Open image</DialogTitle>
				<DialogDescription>Open your image to load as blocks into the canvas</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button type="submit">Submit</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default OpenImage;
