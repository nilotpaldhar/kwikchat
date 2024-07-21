import "server-only";

import nodemailer from "nodemailer";

async function sendMail({
	from,
	to,
	subject,
	body,
}: {
	from?: string;
	to: string;
	subject: string;
	body: string;
}) {
	const port = parseInt(process.env.SMTP_PORT || "", 10);

	const smtpConfig = {
		host: process.env.SMTP_HOST,
		port: Number.isInteger(port) ? port : undefined,
		secure: false,
		logger: process.env.NODE_ENV === "development",
		debug: process.env.NODE_ENV === "development",
		ignoreTLS: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	};

	const transporter = nodemailer.createTransport(smtpConfig);

	try {
		await transporter.verify();
	} catch (error) {
		throw new Error("Unable to verify SMTP server. Please check your credentials");
	}

	try {
		const result = await transporter.sendMail({
			from: from || process.env.EMAIL_FROM,
			to,
			subject,
			html: body,
		});
		return result;
	} catch (error) {
		throw new Error("Unable to send the email. An error occurred");
	}
}

export default sendMail;
