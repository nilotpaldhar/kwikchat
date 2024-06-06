import { Lock } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import NewPasswordForm from "@/app/(auth)/_components/new-password-form";
import { SigninLink } from "@/app/(auth)/_components/navbar/actions";

const NewPasswordPage = () => (
	<>
		<CardWrapper icon={Lock} title="Change Password" description="Create your new password">
			<NewPasswordForm />
		</CardWrapper>
		<div className="flex justify-center pt-8 md:hidden">
			<SigninLink message="Change your mind?" linkText="Back to Sign In" />
		</div>
	</>
);

export default NewPasswordPage;
