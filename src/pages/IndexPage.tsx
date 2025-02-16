/// <reference types="vite-plugin-svgr/client" />
import { useContext } from "react";
import { Link } from "react-router";

import { ThemeContext } from "@/context/Theme";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import ThemeIcon from "@/components/ThemeIcon";
import ImageComparison from "@/components/home/ImageComparison";

import BlockmaticLogo from "@/assets/blockmatic.svg?react";
import GithubIcon from "@/assets/github.svg?react";
import { ChevronRightIcon } from "lucide-react";

function IndexPage() {
	const { isDark } = useContext(ThemeContext);

	return (
		<main className="flex flex-col items-center font-inter">
			<header className="w-full flex justify-evenly p-8 z-10 gap-8">
				<BlockmaticLogo className="h-20 w-max" fill={"white"} />

				<div className="flex items-center gap-1">
					<Button className="bg-white text-black hover:bg-zinc-50/90 mr-4" asChild>
						<Link to={{ pathname: "/app" }}>Editor</Link>
					</Button>

					<a href="https://github.com/trafficlunar/blockmatic" className="w-7">
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

			<section className="max-w-[40rem] mt-16 mx-8 flex flex-col items-center gap-4">
				<h1 className="text-6xl text-center font-bold">Create pixel art for Minecraft in minutes</h1>
				<h5 className="text-xl text-center">
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

			<section className="max-w-full mx-8 mt-16">
				<img
					src={isDark ? "/blockmatic_screenshot_dark.png" : "/blockmatic_screenshot_light.png"}
					alt="app preview"
					className="max-w-[65rem] w-full rounded-xl border border-zinc-700"
				/>
			</section>

			<section className="flex flex-col items-center mt-32 text-center mx-8">
				<h1 className="text-5xl font-bold mb-2">Pixel art made easy</h1>
				<p className="mb-8 text-lg">Blockmatic makes it easier to make changes and build by using schematics and the web editor.</p>
				<div className="max-w-[56rem] grid grid-cols-3 max-md:grid-cols-2 gap-4 *:flex *:flex-col *:items-center *:gap-1 *:text-center *:p-4 *:border *:border-zinc-300 *:dark:border-zinc-800 *:rounded-lg *:bg-zinc-100 *:dark:bg-zinc-900 *:text-black *:dark:text-white">
					<div>
						<img
							src="/shinji.png"
							alt="shinji"
							className="w-full rounded mb-4 border bg-zinc-300 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-800"
						/>
						<h2 className="font-bold text-xl">Open your image</h2>
						<p>Open your image, or start drawing immediately with the editor.</p>
					</div>
					<div>
						<img
							src={isDark ? "/drawing_erasing.gif" : "/drawing_erasing_light.gif"}
							alt="tool example gif"
							className="w-full rounded mb-4 border border-zinc-300 dark:border-zinc-800"
						/>
						<h2 className="font-bold text-xl">Make changes</h2>
						<p>Change blocks around with the replace, selection, shape, pencil, and eraser tools</p>
					</div>
					<div>
						<img src="/shinji_minecraft.png" alt="shinji in minecraft" className="w-full rounded mb-4 border border-zinc-300 dark:border-zinc-800" />
						<h2 className="font-bold text-xl">Export your art</h2>
						<p>Once you're done, you can export your canvas as a .png, .litematic, or .schem.</p>
					</div>
				</div>
			</section>

			<section className="flex flex-col items-center mt-32 mx-8 max-w-[40rem]">
				<h1 className="text-5xl font-bold mb-2 text-center">See the difference</h1>
				<p className="mb-8 text-lg text-center">
					Blockmatic lets you pick what blocks you want for the image and change versions from 1.6.1 to the latest version.
				</p>
				<ImageComparison />
			</section>

			<footer className="w-full h-16 mt-20 flex flex-col items-center">
				<Separator className="max-w-[40rem]" />

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
