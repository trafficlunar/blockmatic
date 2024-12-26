import { createContext, ReactNode, useState } from "react";

interface Context {
	image: HTMLImageElement | undefined;
	imageDimensions: Dimension;
	setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>;
	setImageDimensions: React.Dispatch<React.SetStateAction<Dimension>>;
}

interface Props {
	children: ReactNode;
}

export const ImageContext = createContext<Context>({} as Context);

export const ImageProvider = ({ children }: Props) => {
	const [image, setImage] = useState<HTMLImageElement>();
	const [imageDimensions, setImageDimensions] = useState<Dimension>({ width: 0, height: 0 });

	return <ImageContext.Provider value={{ image, imageDimensions, setImage, setImageDimensions }}>{children}</ImageContext.Provider>;
};
