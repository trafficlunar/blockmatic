import { useContext } from "react";

import { ToolContext } from "@/context/Tool";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function ToolSettings() {
	const { tool, radius, shape, filled, setRadius, setShape, setFilled } = useContext(ToolContext);

	return (
		<div className="grid grid-cols-2 items-center gap-1.5">
			<Label htmlFor="radius">Radius</Label>
			<Input
				name="radius"
				type="number"
				min={1}
				max={10}
				value={radius}
				onChange={(e) => setRadius(Math.min(Math.max(parseInt(e.target.value), 1), 10))}
			/>

			{tool === "shape" && (
				<>
					<Label htmlFor="shape">Shape</Label>
					<Select value={shape} onValueChange={(value) => setShape(value as Shape)}>
						<SelectTrigger>
							<SelectValue placeholder="Select a shape" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="line">Line</SelectItem>
								<SelectItem value="rectangle">Rectangle</SelectItem>
								<SelectItem value="circle">Circle</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					<Label htmlFor="filled">Filled</Label>
					<Checkbox name="filled" checked={filled} onCheckedChange={(checked) => setFilled(!!checked)} className="w-6 h-6" />
				</>
			)}
		</div>
	);
}

export default ToolSettings;
