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
			<Body className="mx-auto my-auto bg-white px-2 font-sans text-neutral-700">
				<Container className="mx-auto my-10 max-w-[460px] rounded border border-solid border-neutral-200 p-6">
					<Section>
						<Heading className="text-2xl font-bold">Two-Factor Authentication</Heading>
					</Section>
					<Section>
						<Text>Hello {username},</Text>
						<Text>Your one-time password (OTP) for logging in is:</Text>
					</Section>

					<Section className="my-4 ml-0 mr-auto max-w-[140px] rounded bg-neutral-100">
						<Text className="block text-center text-xl font-medium leading-6 tracking-[12px] text-neutral-900">
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

					<Hr className="mx-0 w-full border border-solid border-neutral-100" />
					<Text className="mt-4 text-center text-xs font-light text-neutral-500">
						&copy; 2024 KwikChat. All rights reserved.
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export default TwoFactorTokenEmail;
