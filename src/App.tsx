import { useEffect, useRef, useState } from "react";
import { Image, Layer, Stage, Text } from "react-konva";

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";

import ThemeChanger from "./components/menubar/theme-changer";
import useImage from "use-image";

function App() {
	const stageContainerRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef(null);

	const [stageSize, setStageSize] = useState({
		width: 0,
		height: 0,
	});

	const [stageScale, setStageScale] = useState(1);
	const [stageCoords, setStageCoords] = useState({
		x: 0,
		y: 0,
	});

	const [image] = useImage("/blocks/programmer-art/stone.png");

	const onWheel = (e) => {
		const stage = e.target.getStage();
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();

		const mousePoint = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		};

		const newScale = e.evt.deltaY < 0 ? oldScale * 1.05 : oldScale / 1.05;

		setStageScale(newScale);
		setStageCoords({
			x: pointer.x - mousePoint.x * newScale,
			y: pointer.y - mousePoint.y * newScale,
		});
	};

	useEffect(() => {
		if (stageContainerRef.current && stageRef.current) {
			setStageSize({
				width: stageContainerRef.current.offsetWidth,
				height: stageContainerRef.current.offsetHeight,
			});
		}
	}, []);

	return (
		<main className="h-screen grid grid-rows-[2.5rem_1fr]">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>Open Schematic</MenubarItem>
						<MenubarItem>Open Image</MenubarItem>

						<MenubarSeparator />

						<MenubarSub>
							<MenubarSubTrigger>Export to...</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem>.schematic</MenubarItem>
								<MenubarItem>.litematic</MenubarItem>
								<MenubarItem>image</MenubarItem>
							</MenubarSubContent>
						</MenubarSub>
					</MenubarContent>
				</MenubarMenu>

				<MenubarMenu>
					<MenubarTrigger>More</MenubarTrigger>
					<MenubarContent>
						<ThemeChanger />
					</MenubarContent>
				</MenubarMenu>
			</Menubar>

			<div ref={stageContainerRef} className="w-full h-full">
				<Stage
					width={stageSize.width}
					height={stageSize.height}
					draggable
					ref={stageRef}
					x={stageCoords.x}
					y={stageCoords.y}
					scaleX={stageScale}
					scaleY={stageScale}
					onWheel={onWheel}
				>
					<Layer imageSmoothingEnabled={false}>
						<Text text="test" fontSize={20} fill="white" />
						<Image image={image} />
					</Layer>
				</Stage>
			</div>
		</main>
	);
}

export default App;
