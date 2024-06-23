"use server";

import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/auth/tokens";
import validateCredentials from "@/lib/auth/validate-credentials";

import { SIGNIN_MESSAGE as MESSAGE } from "@/constants/auth";

async function resend2FAToken({ email, password }: { email: string; password: string }) {
	try {
		const { user } = await validateCredentials({ email, password });
		if (!user) {
			return { error: MESSAGE.error.invalidCredentials };
		}

		const twoFactorToken = await generateTwoFactorToken(email);

		await sendTwoFactorTokenEmail({
			email: twoFactorToken.email,
			username: user.username as string,
			otp: twoFactorToken.otp,
		});

		return { success: MESSAGE.success.twoFactorAuthEmail };
	} catch (error) {
		return { error: MESSAGE.error.twoFactorAuthEmail };
	}
}

export default resend2FAToken;
