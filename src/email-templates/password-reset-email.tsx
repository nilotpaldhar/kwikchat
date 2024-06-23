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

interface PasswordResetEmailProps {
	url: string;
	username: string;
	previewText?: string;
}

const PasswordResetEmail = ({ url, username, previewText }: PasswordResetEmailProps) => (
	<Html lang="en">
		<Head />
		{previewText && <Preview>{previewText}</Preview>}
		<Tailwind>
			<Body className="bg-white text-neutral-700 my-auto mx-auto font-sans px-2">
				<Container className="max-w-[460px] rounded mx-auto my-10 p-6 border border-solid border-neutral-200">
					<Section>
						<Heading className="text-2xl font-bold">Password Reset Request</Heading>
					</Section>
					<Section>
						<Text>Hello {username},</Text>
						<Text>
							We received a request to reset your password. Please click the button below to reset
							your password:
						</Text>
						<Button
							href={url}
							className="inline-block px-5 py-3 bg-[#27AE80] text-white rounded-md text-sm font-medium"
						>
							Reset Password
						</Button>
						<Text>
							If you did not request a password reset, please ignore this email or contact support
							if you have questions.
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

export default PasswordResetEmail;
