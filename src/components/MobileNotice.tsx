import { useEffect, useState } from "react";
import { SmartphoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function MobileNotice() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(window.innerWidth <= 600);
	}, []);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
			<DialogContent className="w-96 rounded-lg">
				<DialogHeader className="flex items-center">
					<SmartphoneIcon size={64} className="mb-2" />

					<DialogTitle>Phone Detected</DialogTitle>
					<DialogDescription>Using a phone with Blockmatic is not supported as of right now. Proceed with caution.</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<DialogClose>
						<Button type="button">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default MobileNotice;
