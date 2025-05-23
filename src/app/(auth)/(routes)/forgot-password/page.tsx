import type { Metadata } from "next";

import { Lock } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import ForgotPasswordForm from "@/app/(auth)/_components/forms/forgot-password-form";
import { SigninLink } from "@/app/(auth)/_components/navbar/actions";

export const metadata: Metadata = {
	title: "Forgot Password",
	description: "Recover access to your account through a secure password reset process.",
};

const ForgotPasswordPage = () => (
	<>
		<CardWrapper
			icon={Lock}
			title="Reset Password"
			description="Enter your Email to reset your password"
		>
			<ForgotPasswordForm />
		</CardWrapper>
		<div className="flex justify-center pt-8 md:hidden">
			<SigninLink message="Change your mind?" linkText="Back to Sign In" />
		</div>
	</>
);

export default ForgotPasswordPage;
