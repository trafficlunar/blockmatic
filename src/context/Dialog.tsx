import { Dialog } from "@/components/ui/dialog";
import { createContext, lazy, ReactNode, Suspense, useRef, useState } from "react";

type Context = (id: string) => void;

interface Props {
	children: ReactNode;
}

export const DialogContext = createContext<Context>({} as Context);

export const DialogProvider = ({ children }: Props) => {
	const [open, setOpen] = useState(false);
	const [id, setId] = useState("");

	const onSubmitRef = useRef<(() => void) | null>(null);

	const openDialog = (id: string) => {
		setId(id);
		setOpen(true);
	};

	const dialogKeyHandler = (e: React.KeyboardEvent) => {
		if (!onSubmitRef.current) return;
		if (e.key !== "Enter") return;

		onSubmitRef.current();
		close();
	};

	const LazyDialogContent = id ? lazy<React.ComponentType<DialogProps>>(() => import(`@/components/dialogs/${id}.tsx`)) : null;

	return (
		<DialogContext.Provider value={openDialog}>
			<Dialog open={open} onOpenChange={(value) => setOpen(value)}>
				{LazyDialogContent && (
					<Suspense fallback={<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Loading dialog...</div>}>
						<LazyDialogContent close={() => setOpen(false)} registerSubmit={(fn) => (onSubmitRef.current = fn)} dialogKeyHandler={dialogKeyHandler} />
					</Suspense>
				)}
			</Dialog>

			{children}
		</DialogContext.Provider>
	);
};
