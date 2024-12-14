import { createContext, ReactNode, useState } from "react";

interface Props {
	children: ReactNode;
}

export const ImageContext = createContext({
	image: new Image() as HTMLImageElement | undefined,
	imageDimensions: { width: 0, height: 0 } as Dimension,
	setImage: (image: HTMLImageElement) => {},
	setImageDimensions: (dimension: Dimension) => {},
});

export const ImageProvider = ({ children }: Props) => {
	const [image, setImage] = useState<HTMLImageElement>();
	const [imageDimensions, setImageDimensions] = useState<Dimension>({ width: 0, height: 0 });

	return <ImageContext.Provider value={{ image, imageDimensions, setImage, setImageDimensions }}>{children}</ImageContext.Provider>;
};
