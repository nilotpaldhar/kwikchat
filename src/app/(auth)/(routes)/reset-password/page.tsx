import type { Metadata } from "next";

import { TokenValidationStatus } from "@/types";

import { validateToken } from "@/lib/auth/tokens";

import Link from "next/link";
import { Lock, Info, XOctagon } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import ResetPasswordForm from "@/app/(auth)/_components/forms/reset-password-form";
import { SigninLink } from "@/app/(auth)/_components/navbar/actions";
import ValidationFeedback from "@/app/(auth)/_components/validation-feedback";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Reset Password",
	description: "Set a new password to maintain the security of your account.",
};

interface ResetPasswordPageProps {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const ValidationFeedbackInvalid = () => (
	<div className="flex h-full items-center">
		<ValidationFeedback icon={XOctagon} heading="Email Reset Failed">
			<p>It seems that the password reset link is invalid.</p>
			<Button className="w-full" asChild>
				<Link href="/forgot-password">Go Back</Link>
			</Button>
		</ValidationFeedback>
	</div>
);

const ResetPasswordPage = async (props: ResetPasswordPageProps) => {
	const searchParams = await props.searchParams;
	const token = searchParams?.token;

	/** Token doesn't exist */
	if (!token || Array.isArray(token)) {
		return <ValidationFeedbackInvalid />;
	}

	const { data, status } = await validateToken({ token, tokenType: "PasswordResetToken" });

	/** Token verified */
	if (status === TokenValidationStatus.Default && data?.email && data?.token) {
		return (
			<>
				<CardWrapper icon={Lock} title="Change Password" description="Create your new password">
					<ResetPasswordForm email={data.email} token={data.token} />
				</CardWrapper>
				<div className="flex justify-center pt-8 md:hidden">
					<SigninLink message="Change your mind?" linkText="Back to Sign In" />
				</div>
			</>
		);
	}

	/** Token expired */
	if (status === TokenValidationStatus.TokenExpired) {
		return (
			<div className="flex h-full items-center">
				<ValidationFeedback icon={Info} heading="Password reset link expired">
					<p>It seems that the password link has expired.</p>
					<Button className="w-full" asChild>
						<Link href="/forgot-password">Go Back</Link>
					</Button>
				</ValidationFeedback>
			</div>
		);
	}

	return <ValidationFeedbackInvalid />;
};

export default ResetPasswordPage;
