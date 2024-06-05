"use client";

import { Button } from "@/components/ui/button";
import { Google, Facebook } from "@/components/icon";

interface SocialAuthProps {
	callbackUrl: string;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ callbackUrl }) => {
	const onCLick = (provider: "google" | "facebook") => {
		// eslint-disable-next-line no-console
		console.log({ provider, callbackUrl });
	};

	return (
		<div className="w-full flex flex-col space-y-3">
			<Button variant="outline" className="w-full space-x-2" onClick={() => onCLick("google")}>
				<Google size={18} />
				<span>Continue with Google</span>
			</Button>
			<Button variant="outline" className="w-full space-x-2" onClick={() => onCLick("facebook")}>
				<Facebook size={18} />
				<span>Continue with Facebook</span>
			</Button>
		</div>
	);
};

export default SocialAuth;
