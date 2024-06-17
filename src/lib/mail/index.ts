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

// eslint-disable-next-line import/prefer-default-export
export { sendVerificationEmail };
