/// <reference types="vite-plugin-svgr/client" />
import { useContext } from "react";
import { Link } from "react-router";

import { ThemeContext } from "@/context/Theme";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import ThemeIcon from "@/components/home/ThemeIcon";
import ImageComparison from "@/components/home/ImageComparison";

import BlockmaticLogo from "@/assets/blockmatic.svg?react";
import GithubIcon from "@/assets/github.svg?react";
import { ChevronRightIcon } from "lucide-react";

function IndexPage() {
	const { isDark } = useContext(ThemeContext);

	return (
		<main className="flex flex-col items-center">
			<header className="w-full flex justify-evenly p-8 z-10">
				<BlockmaticLogo className="h-16 w-max" fill={"white"} />

				<div className="flex items-center gap-2">
					<Button className="bg-white text-black hover:bg-zinc-50/90 mr-4" asChild>
						<Link to={{ pathname: "/app" }}>Editor</Link>
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
				className="absolute w-full object-cover -z-20"
				style={{ maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(255,255,255,0) 100%)" }}
			/>

			<section className="w-[40rem] mt-16 flex flex-col items-center gap-4">
				<h1 className="text-6xl text-center font-inter font-bold">Create pixel art for Minecraft in minutes</h1>
				<h5 className="text-xl font-inter">
					Open images, draw, and export your art with{" "}
					<span className="bg-white px-1 rounded">
						<span className="text-blockmatic-green font-bold">block</span>
						<span className="text-blockmatic-brown font-bold">matic</span>
					</span>
				</h5>
				<Button className="w-min h-11 mt-4" asChild>
					<Link to={{ pathname: "/app" }} className="!text-base">
						Go to Editor
						<ChevronRightIcon className="!h-6 !w-6" />
					</Link>
				</Button>
			</section>

			<section className="max-w-full px-20 mt-16">
				<img
					src={isDark ? "/blockmatic_screenshot_dark.png" : "/blockmatic_screenshot_light.png"}
					alt="app preview"
					className="max-w-[65rem] w-full rounded-xl border border-zinc-700"
				/>
			</section>

			<section className="flex flex-col items-center mt-12">
				<h1 className="text-5xl font-inter font-bold mb-2">See the difference</h1>
				<p className="mb-8 text-lg">Blockmatic lets you transform images into pixel art schematics for Minecraft</p>
				<ImageComparison />
			</section>

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
