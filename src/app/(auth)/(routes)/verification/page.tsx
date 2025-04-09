import type { Metadata } from "next";

import Link from "next/link";

import { TokenValidationStatus } from "@/types";

import { validateToken } from "@/lib/auth/tokens";

import { CheckCircle, Info, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ValidationFeedback from "@/app/(auth)/_components/validation-feedback";

export const metadata: Metadata = {
	title: "Verify Account",
	description: "Complete the verification process to unlock full platform features.",
};

interface VerificationPageProps {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const VerificationFeedbackInvalid = () => (
	<div className="flex h-full items-center">
		<ValidationFeedback icon={XOctagon} heading="Email Verification Failed">
			<p>
				It seems that the email verification link is invalid. Don&apos;t worry! Simply request a new
				link by signing in again.
			</p>
			<Button className="w-full" asChild>
				<Link href="/sign-in">Try Agian!</Link>
			</Button>
		</ValidationFeedback>
	</div>
);

const VerificationPage = async (props: VerificationPageProps) => {
	const searchParams = await props.searchParams;
	const token = searchParams?.token;

	/** Token doesn't exist */
	if (!token || Array.isArray(token)) {
		return <VerificationFeedbackInvalid />;
	}

	const { data, status } = await validateToken({ token, tokenType: "VerificationToken" });

	/** Token verified */
	if (status === TokenValidationStatus.Default && data?.email) {
		return (
			<div className="flex h-full items-center">
				<ValidationFeedback icon={CheckCircle} heading="Email Verified">
					<p>
						Congratulations! Your email address <strong>{data.email}</strong>, has been successfully
						verified.
					</p>
					<Button className="w-full" asChild>
						<Link href="/sign-in">Sign In Now</Link>
					</Button>
				</ValidationFeedback>
			</div>
		);
	}

	/** Token expired */
	if (status === TokenValidationStatus.TokenExpired) {
		return (
			<div className="flex h-full items-center">
				<ValidationFeedback icon={Info} heading="Verification Link Expired">
					<p>
						It seems that the email verification link has expired. No worries! Simply request a new
						link by signing in again.
					</p>
					<Button className="w-full" asChild>
						<Link href="/sign-in">Try Agian!</Link>
					</Button>
				</ValidationFeedback>
			</div>
		);
	}

	return <VerificationFeedbackInvalid />;
};

export default VerificationPage;
