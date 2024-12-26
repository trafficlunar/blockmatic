import { useContext, useEffect, useMemo, useState } from "react";
import { Alpha, ShadeSlider, Wheel, hsvaToHex, hsvaToRgba, rgbaToHsva } from "@uiw/react-color";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolContext } from "@/context/Tool";

import { findBlockFromRgb } from "@/utils/findBlockFromRgb";

import _blockData from "@/data/blocks/programmer-art/data.json";
import { Button } from "../ui/button";
const blockData: BlockData = _blockData;

function ColorPicker() {
	const { selectedBlock, setSelectedBlock } = useContext(ToolContext);

	const [hsva, setHsva] = useState({ h: 0, s: 0, v: 49.4, a: 1 });
	const rgb = useMemo(() => hsvaToRgba(hsva), [hsva]);

	const limitRgba = (x: number) => Math.min(Math.max(x, 0), 255);

	useEffect(() => {
		const blockInfo = blockData[selectedBlock];
		const rgbColor = { r: blockInfo.color[0], g: blockInfo.color[1], b: blockInfo.color[2], a: blockInfo.color[3] / 255 };
		setHsva(rgbaToHsva(rgbColor));
	}, [selectedBlock]);

	const onClickSet = () => {
		const block = findBlockFromRgb(rgb.r, rgb.g, rgb.b, rgb.a * 255);
		setSelectedBlock(block);
	};

	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="flex flex-col gap-2">
				<Wheel width={125} height={125} color={hsva} onChange={(color) => setHsva(color.hsva)} />
				<ShadeSlider hsva={hsva} onChange={(newShade) => setHsva({ ...hsva, ...newShade })} />
				<Alpha hsva={hsva} onChange={(newAlpha) => setHsva({ ...hsva, ...newAlpha })} />
			</div>

			<div className="relative">
				<div className="flex gap-2 items-center">
					<Label htmlFor="r">R</Label>
					<Input
						name="r"
						type="number"
						className="h-8"
						value={rgb.r}
						onChange={(e) => setHsva(rgbaToHsva({ ...rgb, r: limitRgba(parseInt(e.target.value)) }))}
					/>
				</div>
				<div className="flex gap-2 items-center">
					<Label htmlFor="g">G</Label>
					<Input
						name="g"
						type="number"
						className="h-8"
						value={rgb.g}
						onChange={(e) => setHsva(rgbaToHsva({ ...rgb, g: limitRgba(parseInt(e.target.value)) }))}
					/>
				</div>
				<div className="flex gap-2 items-center">
					<Label htmlFor="b">B</Label>
					<Input
						name="b"
						type="number"
						className="h-8"
						value={rgb.b}
						onChange={(e) => setHsva(rgbaToHsva({ ...rgb, b: limitRgba(parseInt(e.target.value)) }))}
					/>
				</div>
				<div className="flex gap-2 items-center">
					<Label htmlFor="a">A</Label>
					<Input
						name="a"
						type="number"
						className="h-8"
						value={Math.floor(rgb.a * 255)}
						onChange={(e) => setHsva(rgbaToHsva({ ...rgb, a: limitRgba(parseInt(e.target.value)) }))}
					/>
				</div>

				<div className="w-full h-2 mt-1" style={{ backgroundColor: hsvaToHex(hsva) }}></div>

				<Button variant="outline" onClick={onClickSet} className="mt-1 h-8 w-full">
					Set
				</Button>
			</div>
		</div>
	);
}

export default ColorPicker;
