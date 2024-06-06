import { UserPlus } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import SigupForm from "@/app/(auth)/_components/sigup-form";
import SocialAuth from "@/app/(auth)/_components/social-auth";
import { SigninLink } from "@/app/(auth)/_components/navbar/actions";
import { Divider } from "@/components/ui/divider";

const SignUpPage = () => (
	<>
		<CardWrapper
			icon={UserPlus}
			title="Create a new account"
			description="Enter your details to register"
		>
			<SigupForm />
			<Divider>OR</Divider>
			<SocialAuth callbackUrl="/" />
		</CardWrapper>
		<div className="flex justify-center pt-8 md:hidden">
			<SigninLink />
		</div>
	</>
);

export default SignUpPage;
