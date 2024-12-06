import "server-only";

import { getUserByEmail } from "@/data/user";
import { verifyPassword } from "@/lib/auth/password-utils";

export enum ValidationError {
	UserNotFound = "UserNotFound",
	PasswordMismatch = "PasswordMismatch",
	UnknownError = "UnknownError",
}

async function validateCredentials({ email, password }: { email: string; password: string }) {
	try {
		const user = await getUserByEmail(email, true);
		if (!user || !user.email || !user.password) {
			return { user: null, error: ValidationError.UserNotFound };
		}

		const passwordsMatch = verifyPassword(password, user.password);
		if (!passwordsMatch) {
			return { user: null, error: ValidationError.PasswordMismatch };
		}

		return { user, error: null };
	} catch (error) {
		return { user: null, error: ValidationError.UnknownError };
	}
}

export default validateCredentials;
