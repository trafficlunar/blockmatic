/// <reference types="vite-plugin-svgr/client" />
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

import BlockmaticLogo from "@/assets/blockmatic.svg?react";
import GithubIcon from "@/assets/github.svg?react";

// @ts-expect-error - vite-imagetools plugin
import Screenshot1 from "@/assets/screenshot1.png?format=webp";
// @ts-expect-error - vite-imagetools plugin
import Screenshot2 from "@/assets/screenshot2.png?format=webp";

function IndexPage() {
	return (
		<main className="flex flex-col items-center">
			<header className="w-full flex justify-evenly p-8">
				<BlockmaticLogo className="h-16 w-max" fill={"white"} />

				<div className="flex items-center gap-8">
					<Button variant="link" asChild>
						<Link to={{ pathname: "/app" }}>Go to app</Link>
					</Button>
					<a href="https://github.com/trafficlunar/blockmatic" className="w-6">
						<GithubIcon fill="white" />
					</a>
				</div>
			</header>

			<div className="absolute w-full h-full -z-20">
				<div className="absolute inset-0 bg-gradient-to-t from-black/100 to-black/0 z-10"></div>
				<img src={Screenshot1} alt="screenshot" className="w-full h-full object-cover" />
			</div>

			<h1 className="text-5xl font-[Inter] font-bold mt-32">Convert your images to schematics</h1>

			<img src={Screenshot2} alt="bliss" className="w-[90%] rounded-xl mt-32 border border-zinc-700 glow" />
		</main>
	);
}

export default IndexPage;
