import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router";

function PrivacyPolicy() {
	return (
		<div className="p-16">
			<Link to={{ pathname: "/" }} className="flex gap-1 mb-4 underline-offset-4 hover:underline">
				<ArrowLeftIcon /> back
			</Link>

			<h1 className="text-2xl font-medium">Privacy Policy</h1>
			<p className="mb-4">
				<strong>Effective Date:</strong> January 2, 2025
			</p>

			<p>By using this website, you confirm that you understand and agree to this Privacy Policy.</p>

			<ul className="list-disc ml-8 py-2">
				<li>Blockmatic does not collect, store, or process any data in any form.</li>
				<li>It also does not use cookies or analytics services.</li>
				<li>
					Blockmatic is hosted by Vercel. I can not guarantee that Vercel does not collect any data, therefore I recommend reviewing their privacy
					policy for clarification.
				</li>
			</ul>

			<p>
				If you have any questions or concerns, please contact me at:{" "}
				<a href="mailto:hello@trafficlunar.net" className="text-blue-500 dark:text-blue-300">
					hello@trafficlunar.net
				</a>
			</p>
		</div>
	);
}

export default PrivacyPolicy;
