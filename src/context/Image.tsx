import { createContext, ReactNode, useState } from "react";

interface Context {
	image: HTMLImageElement | undefined;
	imageDimensions: Dimension;
	usableBlocks: string[];
	setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>;
	setImageDimensions: React.Dispatch<React.SetStateAction<Dimension>>;
	setUsableBlocks: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Props {
	children: ReactNode;
}

export const ImageContext = createContext<Context>({} as Context);

export const ImageProvider = ({ children }: Props) => {
	const [image, setImage] = useState<HTMLImageElement>();
	const [imageDimensions, setImageDimensions] = useState<Dimension>({ width: 0, height: 0 });
	const [usableBlocks, setUsableBlocks] = useState<string[]>([]);

	return (
		<ImageContext.Provider value={{ image, imageDimensions, usableBlocks, setImage, setImageDimensions, setUsableBlocks }}>
			{children}
		</ImageContext.Provider>
	);
};
