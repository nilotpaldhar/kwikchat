import * as React from "react";
import {
	Html,
	Body,
	Container,
	Head,
	Heading,
	Preview,
	Section,
	Text,
	Tailwind,
	Hr,
} from "@react-email/components";

interface TwoFactorTokenEmailProps {
	otp: string;
	username: string;
	previewText?: string;
}

const TwoFactorTokenEmail = ({ otp, username, previewText }: TwoFactorTokenEmailProps) => (
	<Html lang="en">
		<Head />
		{previewText && <Preview>{previewText}</Preview>}
		<Tailwind>
			<Body className="bg-white text-neutral-700 my-auto mx-auto font-sans px-2">
				<Container className="max-w-[460px] rounded mx-auto my-10 p-6 border border-solid border-neutral-200">
					<Section>
						<Heading className="text-2xl font-bold">Two-Factor Authentication</Heading>
					</Section>
					<Section>
						<Text>Hello {username},</Text>
						<Text>Your one-time password (OTP) for logging in is:</Text>
					</Section>

					<Section className="bg-neutral-100 rounded my-4 mr-auto ml-0 max-w-[140px]">
						<Text className="block text-neutral-900 text-xl font-medium leading-6 text-center tracking-[12px]">
							{otp}
						</Text>
					</Section>

					<Section>
						<Text>
							This OTP is valid for the next 10 minutes. Please do not share this code with anyone.
						</Text>
						<Text>
							If you did not request this, please ignore this email or contact support if you have
							any questions.
						</Text>
					</Section>

					<Hr className="border border-solid border-neutral-100 mx-0 w-full" />
					<Text className="mt-4 text-center font-light text-xs text-neutral-500">
						&copy; 2024 KwikChat. All rights reserved.
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export default TwoFactorTokenEmail;
