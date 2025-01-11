/// <reference types="vite-plugin-svgr/client" />
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import BlockmaticLogo from "@/assets/blockmatic.svg?react";
import GithubIcon from "@/assets/github.svg?react";

import ThemeIcon from "@/components/home/ThemeIcon";
import AppPreview from "@/components/home/AppPreview";
import ImageComparison from "@/components/home/ImageComparison";

function IndexPage() {
	return (
		<main className="flex flex-col items-center">
			<header className="w-full flex justify-evenly p-8">
				<BlockmaticLogo className="h-16 w-max" fill={"white"} />

				<div className="flex items-center gap-2">
					<Button className="bg-white text-black hover:bg-zinc-50/90 mr-4" asChild>
						<Link to={{ pathname: "/app" }}>Go to app</Link>
					</Button>

					<a href="https://github.com/trafficlunar/blockmatic" className="w-8">
						<GithubIcon fill="white" />
					</a>
					<ThemeIcon />
				</div>
			</header>

			<img
				src="/screenshot1.png"
				alt="screenshot"
				className="absolute w-full h-full object-cover -z-20"
				style={{ maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(255,255,255,0) 100%)" }}
			/>

			<div className="absolute w-[30rem] -top-8 flex">
				<img src="/oak_hanging_sign.png" alt="sign" className="absolute w-full -z-10" style={{ imageRendering: "pixelated" }} />

				<Link to={{ pathname: "/app" }} className="text-6xl font-minecraft mt-[15.5rem] text-black text-center">
					Create pixel art for Minecraft in minutes
				</Link>
			</div>

			<AppPreview />

			<h1 className="text-5xl font-pixel font-bold mt-32">See the difference</h1>
			<ImageComparison />

			<footer className="w-full h-16 mt-20 flex flex-col items-center">
				<Separator className="w-2/5" />

				<div className="mt-8 flex justify-center items-center gap-16 text-zinc-500">
					<Link to={{ pathname: "/privacy-policy" }}>Privacy</Link>

					<a href="mailto:hello@trafficlunar.net">hello@trafficlunar.net</a>
				</div>
				<span className="text-zinc-400 mt-2 pb-8">
					made by{" "}
					<span className="text-orange-400 opacity-75">
						<a href="https://trafficlunar.net">trafficlunar</a>
					</span>
				</span>
			</footer>
		</main>
	);
}

export default IndexPage;
