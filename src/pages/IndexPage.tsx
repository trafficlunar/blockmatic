/// <reference types="vite-plugin-svgr/client" />
import { Link } from "react-router";

import { Button } from "@/components/ui/button";

import BlockmaticLogo from "@/assets/blockmatic.svg?react";
import GithubIcon from "@/assets/github.svg?react";

function IndexPage() {
	return (
		<main className="flex flex-col items-center">
			<header className="w-full flex justify-evenly p-8">
				<BlockmaticLogo className="h-16 w-max" />

				<div className="flex items-center gap-8">
					<Button variant="link" asChild>
						<Link to={{ pathname: "/app" }}>Go to app</Link>
					</Button>
					<a href="https://github.com/trafficlunar/blockmatic" className="w-6">
						<GithubIcon fill="white" />
					</a>
				</div>
			</header>
		</main>
	);
}

export default IndexPage;
