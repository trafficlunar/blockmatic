import { createContext, ReactNode, useState } from "react";
import LoadingIndicator from "@/assets/loading.svg?react";

interface Context {
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
	children: ReactNode;
}

export const LoadingContext = createContext<Context>({} as Context);

export const LoadingProvider = ({ children }: Props) => {
	const [loading, setLoading] = useState(true);

	return (
		<LoadingContext.Provider value={{ loading, setLoading }}>
			{loading && (
				<div className="absolute w-full h-full z-[9999] backdrop-brightness-50 flex justify-center items-center gap-4">
					<LoadingIndicator fill="white" className="w-16 h-16" />
				</div>
			)}
			{children}
		</LoadingContext.Provider>
	);
};
