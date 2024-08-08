"use client";

import { Suspense } from "react";
import SigninCard from "@/app/(auth)/_components/signin-card";

const SignInPage = () => (
	<Suspense>
		<SigninCard />
	</Suspense>
);

export default SignInPage;
