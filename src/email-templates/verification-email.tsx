import * as React from "react";
import {
	Html,
	Body,
	Button,
	Container,
	Head,
	Heading,
	Preview,
	Section,
	Text,
	Tailwind,
	Hr,
} from "@react-email/components";

interface VerificationEmailProps {
	url: string;
	username: string;
	previewText?: string;
}

const VerificationEmail = ({ url, username, previewText }: VerificationEmailProps) => (
	<Html lang="en">
		<Head />
		{previewText && <Preview>{previewText}</Preview>}
		<Tailwind>
			<Body className="bg-white text-neutral-700 my-auto mx-auto font-sans px-2">
				<Container className="max-w-[460px] rounded mx-auto my-10 p-6 border border-solid border-neutral-200">
					<Section>
						<Heading className="text-2xl font-bold">Email Verification</Heading>
					</Section>
					<Section>
						<Text>Hello {username},</Text>
						<Text>
							Thank you for registering with our service. Please click the button below to verify
							your email address:
						</Text>
						<Button
							href={url}
							className="inline-block px-5 py-3 bg-[#27AE80] text-white rounded-md text-sm font-medium"
						>
							Verify Email
						</Button>
						<Text>If you did not create an account, no further action is required.</Text>
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
export default VerificationEmail;
