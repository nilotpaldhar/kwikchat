const MESSAGE_NOT_KNOWN = "We apologize, but an error has occurred with the server";
const MESSAGE_INVALID_FIELDS = "Invalid input detected" as string;
const MESSAGE_INVALID_CREDENTIALS = "The credentials you entered are incorrect";
const MESSAGE_VERIFICATION_EMAIL =
	"Your verification email has been successfully sent. Please check your inbox";
const EMAIL_NOT_EXIST = "Email address not found. Please check and try again";
const USERNAME_TAKEN =
	"This username is currently in use by another account. Please try a different one";

export const SIGNIN_MESSAGE = {
	error: {
		notKnown: MESSAGE_NOT_KNOWN,
		invalidFields: MESSAGE_INVALID_FIELDS,
		invalidCredentials: MESSAGE_INVALID_CREDENTIALS,
		verificationEmail:
			"Due to an internal error, the verification email could not be sent. We are sorry for the inconvenience",
		invalidTwoFactorAuthOtp: "The 2FA OTP entered is invalid. Please check and try again",
		twoFactorAuthEmail:
			"Due to an internal error, the 2FA email could not be sent. We are sorry for the inconvenience",
		signingIn: "We apologize, but something went wrong while trying to log you into your account",
		OAuthAccountNotLinked: "Email already in use with different provider!",
	},
	success: {
		verificationEmail: MESSAGE_VERIFICATION_EMAIL,
		twoFactorAuthEmail:
			"Your 2FA email has been successfully sent. Please check your inbox to complete the process",
		signingIn: "Welcome back! You have signed in successfully",
	},
} as const;

export const SIGNUP_MESSAGE = {
	error: {
		notKnown: MESSAGE_NOT_KNOWN,
		invalidFields: MESSAGE_INVALID_FIELDS,
		emailTaken: "The email you entered is already associated with an account",
		usernameTaken: USERNAME_TAKEN,
	},
	success: {
		verificationEmail: MESSAGE_VERIFICATION_EMAIL,
	},
} as const;

export const FORGOT_PASSWORD_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		emailNotExist: EMAIL_NOT_EXIST,
		resetEmail: "Unable to send reset email. Please try again later",
	},
	success: {
		resetEmail:
			"A password reset email has been sent to your inbox. Please check your email to proceed",
	},
} as const;

export const RESET_PASSWORD_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		emailNotExist: EMAIL_NOT_EXIST,
		resetPassword: "Password reset unsuccessful. Please try again",
	},
	success: {
		resetPassword: "Password updated successfully. Please sign in now",
	},
} as const;

export const UPDATE_PASSWORD_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		unauthorized: "Unauthorized",
		invalidCredentials: MESSAGE_INVALID_CREDENTIALS,
		oAuth: "OAuth accounts do not support password updates",
		updatePassword: "Password update unsuccessful. Please try again",
	},
	success: {
		updatePassword: "Password updated successfully",
	},
} as const;

export const TOGGLE_2FA_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		unauthorized: "Unauthorized",
		oAuth: "OAuth accounts do not support two-factor authentication",
		invalidCredentials: MESSAGE_INVALID_CREDENTIALS,
		notKnown: MESSAGE_NOT_KNOWN,
	},
	success: {
		enabled: "Two-factor authentication (2FA) has been enabled for your account",
		disabled: "Two-factor authentication (2FA) has been disabled for your account",
	},
} as const;

export const UPDATE_USERNAME_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		unauthorized: "Unauthorized",
		invalidCredentials: MESSAGE_INVALID_CREDENTIALS,
		usernameTaken: USERNAME_TAKEN,
		updateUsername: "Username update unsuccessful. Please try again",
	},
	success: {
		updateUsername: "Username updated successfully",
	},
} as const;
