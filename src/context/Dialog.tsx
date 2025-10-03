import { Dialog } from "@/components/ui/dialog";
import { createContext, lazy, ReactNode, Suspense, useRef, useState } from "react";

type Context = (id: string) => void;

interface Props {
	children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
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
					<Suspense>
						<LazyDialogContent close={() => setOpen(false)} registerSubmit={(fn) => (onSubmitRef.current = fn)} dialogKeyHandler={dialogKeyHandler} />
					</Suspense>
				)}
			</Dialog>

			{children}
		</DialogContext.Provider>
	);
};
