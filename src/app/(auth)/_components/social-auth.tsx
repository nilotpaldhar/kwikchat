"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Google } from "@/components/icon";

import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";

interface SocialAuthProps {
	callbackUrl?: string;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ callbackUrl }) => {
	const onCLick = (provider: "google") => {
		signIn(provider, {
			callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
		});
	};

	return (
		<div className="flex w-full flex-col space-y-3">
			<Button variant="outline" className="w-full space-x-2" onClick={() => onCLick("google")}>
				<Google size={18} />
				<span>Continue with Google</span>
			</Button>
		</div>
	);
};

export default SocialAuth;
