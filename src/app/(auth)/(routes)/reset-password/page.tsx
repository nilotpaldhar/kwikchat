import { TokenValidationStatus } from "@/types";

import { validateToken } from "@/lib/auth/tokens";

import Link from "next/link";
import { Lock, Info, XOctagon } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import ResetPasswordForm from "@/app/(auth)/_components/forms/reset-password-form";
import { SigninLink } from "@/app/(auth)/_components/navbar/actions";
import ValidationFeedback from "@/app/(auth)/_components/validation-feedback";
import { Button } from "@/components/ui/button";

interface ResetPasswordPageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

const ValidationFeedbackInvalid = () => (
	<div className="flex items-center h-full">
		<ValidationFeedback icon={XOctagon} heading="Email Reset Failed">
			<p>It seems that the password reset link is invalid.</p>
			<Button className="w-full" asChild>
				<Link href="/forgot-password">Go Back</Link>
			</Button>
		</ValidationFeedback>
	</div>
);

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
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
			<div className="flex items-center h-full">
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
