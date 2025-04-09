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

const PasswordResetEmail = ({
	url,
	username = "john_doe",
	previewText,
}: PasswordResetEmailProps) => {
	const currentYear = new Date().getFullYear();

	return (
		<Html lang="en">
			<Head />
			{previewText && <Preview>{previewText}</Preview>}
			<Tailwind>
				<Body className="mx-auto my-auto bg-white px-2 font-sans text-neutral-700">
					<Container className="mx-auto my-10 max-w-[460px] rounded border border-solid border-neutral-200 p-6">
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
								className="inline-block rounded-md bg-[#27AE80] px-5 py-3 text-sm font-medium text-white"
							>
								Reset Password
							</Button>
							<Text>
								If you did not request a password reset, please ignore this email or contact support
								if you have questions.
							</Text>
						</Section>
						<Hr className="mx-0 w-full border border-solid border-neutral-100" />
						<Text className="mt-4 text-center text-xs font-light text-neutral-500">
							&copy; {currentYear} KwikChat. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default PasswordResetEmail;
