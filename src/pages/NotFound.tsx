import { useContext } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "lucide-react";

import { ThemeContext } from "@/context/Theme";
import { Button } from "@/components/ui/button";

import BlockmaticLogo from "@/assets/blockmatic-icon.svg?react";
import BlockmaticText from "@/assets/blockmatic-text.svg?react";

function NotFound() {
	const { isDark } = useContext(ThemeContext);

	return (
		<div className="absolute size-full flex flex-col justify-center items-center">
			<div className="flex gap-2 items-center">
				<BlockmaticLogo className="h-8" fill={isDark ? "white" : "black"} />
				<BlockmaticText className="h-3.5" fill={isDark ? "white" : "black"} />
			</div>

			<h1 className="font-bold text-8xl mt-2">404</h1>
			<h2 className="text-xl mb-6">page not found</h2>

			<Button variant="outline" asChild>
				<Link to={{ pathname: "/" }}>
					Go back
					<ChevronLeftIcon className="size-6!" />
				</Link>
			</Button>
		</div>
	);
}

export default NotFound;
