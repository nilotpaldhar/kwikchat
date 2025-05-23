"use client";

import { useState, Suspense } from "react";

import { User, Key } from "lucide-react";

import CardWrapper from "@/app/(auth)/_components/card-wrapper";
import SiginForm from "@/app/(auth)/_components/forms/sigin-form";
import SocialAuth from "@/app/(auth)/_components/social-auth";
import { SignupLink } from "@/app/(auth)/_components/navbar/actions";
import DemoSigninAlert from "@/app/(auth)/_components/demo-signin-alert";

import Loader from "@/components/ui/loader";
import { Divider } from "@/components/ui/divider";

const SigninCard = () => {
	const [userEmail, setUserEmail] = useState("");
	const [show2FAConfirmation, setShow2FAConfirmation] = useState(false);

	return (
		<>
			<CardWrapper
				icon={show2FAConfirmation ? Key : User}
				title={show2FAConfirmation ? "Enter your verification code" : "Welcome back!"}
				description={
					show2FAConfirmation ? (
						<>
							We&apos;ve sent a verification code to <strong>{userEmail}</strong>. Enter the code
							below to verify
						</>
					) : (
						<>We&apos;re so excited to see you again!</>
					)
				}
			>
				<DemoSigninAlert />
				<Suspense
					fallback={
						<div className="flex h-[248px] items-center justify-center">
							<Loader />
						</div>
					}
				>
					<SiginForm
						on2FAConfirmation={({ email, showOtp }) => {
							setUserEmail(email);
							setShow2FAConfirmation(showOtp);
						}}
					/>
				</Suspense>

				{!show2FAConfirmation && (
					<>
						<Divider>OR</Divider>
						<SocialAuth />
					</>
				)}
			</CardWrapper>
			{!show2FAConfirmation && (
				<div className="flex justify-center pt-8 md:hidden">
					<SignupLink />
				</div>
			)}
		</>
	);
};

export default SigninCard;
