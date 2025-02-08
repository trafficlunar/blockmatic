import { createContext, ReactNode, useState } from "react";

interface Context {
	history: HistoryEntry[];
	currentIndex: number;
	isUndoAvailable: boolean;
	isRedoAvailable: boolean;
	addHistory: (name: string, apply: () => void, revert: () => void) => void;
	undo: () => void;
	redo: () => void;
	jumpTo: (index: number) => void;
}

interface Props {
	children: ReactNode;
}

export const HistoryContext = createContext<Context>({} as Context);

export const HistoryProvider = ({ children }: Props) => {
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [currentIndex, setCurrentIndex] = useState(-1);
	const isUndoAvailable = currentIndex > 0;
	const isRedoAvailable = currentIndex < history.length - 1;

	const MAX_HISTORY = 20;

	const addHistory = (name: string, apply: () => void, revert: () => void) => {
		const newHistory = history.slice(0, currentIndex + 1);
		newHistory.push({ name, apply, revert });

		if (newHistory.length > MAX_HISTORY) {
			newHistory.shift();
		} else {
			setCurrentIndex(newHistory.length - 1);
		}

		setHistory(newHistory);
	};

	const undo = () => {
		if (!isUndoAvailable) return;
		history[currentIndex].revert();
		setCurrentIndex(currentIndex - 1);
	};

	const redo = () => {
		if (!isRedoAvailable) return;
		history[currentIndex + 1].apply();
		setCurrentIndex(currentIndex + 1);
	};

	const jumpTo = (index: number) => {
		if (index == currentIndex) return;

		if (index > currentIndex) {
			for (let i = currentIndex + 1; i <= index; i++) {
				history[i].apply();
			}
		} else {
			for (let i = currentIndex; i > index; i--) {
				history[i].revert();
			}
		}

		setCurrentIndex(index);
	};

	return (
		<HistoryContext.Provider
			value={{
				history,
				currentIndex,
				isUndoAvailable,
				isRedoAvailable,
				addHistory,
				undo,
				redo,
				jumpTo,
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
};
