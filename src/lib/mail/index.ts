import { render } from "@react-email/render";
import sendMail from "@/lib/mail/send-mail";

import VerificationEmail from "@/email-templates/verification-email";
import PasswordResetEmail from "@/email-templates/password-reset-email";
import TwoFactorTokenEmail from "@/email-templates/two-factor-token-email";

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;

async function sendVerificationEmail({
	email,
	username,
	token,
}: {
	email: string;
	username: string;
	token: string;
}) {
	const confirmLink = `${DOMAIN}/verification?token=${token}`;
	const body = render(VerificationEmail({ url: confirmLink, username }));

	await sendMail({
		to: email,
		subject: "Please Confirm Your Email Address",
		body,
	});
}

async function sendPasswordResetEmail({
	email,
	username,
	token,
}: {
	email: string;
	username: string;
	token: string;
}) {
	const resetLink = `${DOMAIN}/reset-password?token=${token}`;
	const body = render(PasswordResetEmail({ url: resetLink, username }));

	await sendMail({
		to: email,
		subject: "We Received a Password Reset Request",
		body,
	});
}

async function sendTwoFactorTokenEmail({
	email,
	username,
	otp,
}: {
	email: string;
	username: string;
	otp: string;
}) {
	const body = render(TwoFactorTokenEmail({ username, otp }));

	await sendMail({
		to: email,
		subject: "Two-Factor Authentication Code",
		body,
	});
}

export { sendVerificationEmail, sendPasswordResetEmail, sendTwoFactorTokenEmail };
