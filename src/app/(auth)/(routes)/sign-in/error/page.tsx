"use client";

import { useSearchParams } from "next/navigation";
import { AuthError } from "@/types";

import { XOctagon } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ValidationFeedback from "@/app/(auth)/_components/validation-feedback";

const SignInErrorPage = () => {
	const search = useSearchParams();
	const error = search.get("error") as AuthError;

	if (error === AuthError.Configuration) {
		return (
			<div className="flex items-center h-full">
				<ValidationFeedback icon={XOctagon} heading="Server error!">
					<p>
						There was a problem when trying to authenticate. Please contact us if this error
						persists. Unique error code:
						<code className="text-xs p-1 ml-1 bg-surface-light-300 rounded-sm dark:bg-surface-dark-300">
							Configuration
						</code>
					</p>
				</ValidationFeedback>
			</div>
		);
	}

	if (error === AuthError.AccessDenied) {
		return (
			<div className="flex items-center h-full">
				<ValidationFeedback icon={XOctagon} heading="Access Denied!">
					<p>You do not have permission to login</p>
					<Button className="w-full" asChild>
						<Link href="/sign-in">Back to Sign In</Link>
					</Button>
				</ValidationFeedback>
			</div>
		);
	}

	if (error === AuthError.Verification) {
		return (
			<div className="flex items-center h-full">
				<ValidationFeedback icon={XOctagon} heading="Unable to login!">
					<p>
						The sign in link is no longer valid. It may have been used already or it may have
						expired
					</p>
					<Button className="w-full" asChild>
						<Link href="/sign-in">Back to Sign In</Link>
					</Button>
				</ValidationFeedback>
			</div>
		);
	}

	return (
		<div className="flex items-center h-full">
			<ValidationFeedback icon={XOctagon} heading="Something went wrong">
				<p>Please contact us if this error persists</p>
			</ValidationFeedback>
		</div>
	);
};

export default SignInErrorPage;
