import sendMail from "@/lib/mail/send-mail";

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;

async function sendVerificationEmail({ email, token }: { email: string; token: string }) {
	const confirmLink = `${DOMAIN}/verification?token=${token}`;

	await sendMail({
		to: email,
		subject: "Confirm your email",
		body: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
	});
}

async function sendPasswordResetEmail({ email, token }: { email: string; token: string }) {
	const resetLink = `${DOMAIN}/reset-password?token=${token}`;

	await sendMail({
		to: email,
		subject: "Reset your password",
		body: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
	});
}

async function sendTwoFactorTokenEmail({ email, otp }: { email: string; otp: string }) {
	await sendMail({
		to: email,
		subject: "2FA Code",
		body: `<p>Your 2FA code: ${otp}</p>`,
	});
}

export { sendVerificationEmail, sendPasswordResetEmail, sendTwoFactorTokenEmail };
