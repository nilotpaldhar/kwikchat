import { User } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import SiginForm from "@/app/(auth)/_components/sigin-form";
import SocialAuth from "@/app/(auth)/_components/social-auth";
import { SignupLink } from "@/app/(auth)/_components/navbar/actions";
import { Divider } from "@/components/ui/divider";

const SignInPage = () => (
	<>
		<CardWrapper
			icon={User}
			title="Welcome back!"
			description={<>We&apos;re so excited to see you again!</>}
		>
			<SiginForm />
			<Divider>OR</Divider>
			<SocialAuth callbackUrl="/" />
		</CardWrapper>
		<div className="flex justify-center pt-8 md:hidden">
			<SignupLink />
		</div>
	</>
);

export default SignInPage;
