"use server";

import { generateTwoFactorToken } from "@/lib/auth/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";

import { SIGNIN_MESSAGE as MESSAGE } from "@/constants/auth";

async function resend2FAToken(email: string) {
	try {
		const twoFactorToken = await generateTwoFactorToken(email);

		await sendTwoFactorTokenEmail({
			email: twoFactorToken.email,
			otp: twoFactorToken.otp,
		});

		return { success: MESSAGE.success.twoFactorAuthEmail };
	} catch (error) {
		return { error: MESSAGE.error.twoFactorAuthEmail };
	}
}

export default resend2FAToken;
