import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router";

function PrivacyPolicy() {
	return (
		<div className="p-16 max-sm:p-8">
			<Link to={{ pathname: "/" }} className="flex gap-1 mb-4 underline-offset-4 hover:underline">
				<ArrowLeftIcon /> back
			</Link>

			<h1 className="text-2xl font-medium">Privacy Policy</h1>
			<p className="mb-4">
				<strong>Effective Date:</strong> February 16, 2025
			</p>

			<p>By using this website, you confirm that you understand and agree to this Privacy Policy.</p>

			<ul className="list-disc ml-8 py-2">
				<li>
					Blockmatic collects analytics through a self-hosted instance of{" "}
					<a href="https://umami.is/" className="link">
						Umami
					</a>
					. Umami is GDPR-compliant and{" "}
					<a href="https://umami.is/docs/faq" className="link">
						"does not collect any personally identifiable information and anonymizes all data collected"
					</a>
					.
				</li>
				<li>Blockmatic also does not use cookies.</li>
				<li>
					Blockmatic is hosted by Vercel. I can not guarantee that Vercel does not collect any data, therefore I recommend reviewing their privacy
					policy for clarification.
				</li>
			</ul>

			<p>Please also note that this privacy policy may be updated occasionally. It is recommended to review it from time to time.</p>

			<p className="mt-2">
				If you have any questions or concerns, please contact me at:{" "}
				<a href="mailto:hello@trafficlunar.net" className="link">
					hello@trafficlunar.net
				</a>
			</p>
		</div>
	);
}

export default PrivacyPolicy;
