import { Lock } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import ResetForm from "@/app/(auth)/_components/reset-form";
import { SigninLink } from "@/app/(auth)/_components/navbar/actions";

const ResetPage = () => (
	<>
		<CardWrapper
			icon={Lock}
			title="Reset Password"
			description="Enter your Email to reset your password"
		>
			<ResetForm />
		</CardWrapper>
		<div className="flex justify-center pt-8 md:hidden">
			<SigninLink message="Change your mind?" linkText="Back to Sign In" />
		</div>
	</>
);

export default ResetPage;
