import type { Metadata } from "next";

import SigninCard from "@/app/(auth)/_components/signin-card";

export const metadata: Metadata = {
	title: "Login",
	description: "Access your account securely and continue your conversations effortlessly.",
};

const SignInPage = () => <SigninCard />;

export default SignInPage;
