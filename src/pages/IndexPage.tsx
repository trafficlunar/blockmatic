/// <reference types="vite-plugin-svgr/client" />
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

import BlockmaticLogo from "@/assets/blockmatic.svg?react";
import GithubIcon from "@/assets/github.svg?react";

import AppPreview from "@/components/home/AppPreview";
import ImageComparison from "@/components/home/ImageComparison";

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

			<img
				src="/screenshot1.png"
				alt="screenshot"
				className="absolute w-full h-full object-cover -z-20"
				style={{ maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(255,255,255,0) 100%)" }}
			/>

			<h1 className="text-6xl font-[Inter] font-extrabold mt-32 text-white text-center">Convert your images to schematics</h1>

			<AppPreview />

			<h1 className="text-5xl font-[Inter] font-bold mt-32">See the difference</h1>
			<ImageComparison />

			<footer>
				<Link to={{ pathname: "/privacy-policy" }}>Privacy Policy</Link>
			</footer>
		</main>
	);
}

export default IndexPage;
