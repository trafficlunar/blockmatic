import { useContext } from "react";

import { ToolContext } from "@/context/Tool";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Radius() {
	const { radius, setRadius } = useContext(ToolContext);

	return (
		<div className="grid grid-cols-2 items-center gap-2">
			<Label htmlFor="radius">Radius</Label>
			<Input
				name="radius"
				type="number"
				min={1}
				max={10}
				value={radius}
				onChange={(e) => setRadius(Math.min(Math.max(parseInt(e.target.value), 1), 10))}
			/>
		</div>
	);
}

export default Radius;
