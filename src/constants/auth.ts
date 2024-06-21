const MESSAGE_NOT_KNOWN = "We apologize, but an error has occurred with the server" as string;
const MESSAGE_INVALID_FIELDS = "Invalid input detected" as string;
const MESSAGE_VERIFICATION_EMAIL =
	"Your verification email has been successfully sent. Please check your inbox" as string;

export const SIGNIN_MESSAGE = {
	error: {
		notKnown: MESSAGE_NOT_KNOWN,
		invalidFields: MESSAGE_INVALID_FIELDS,
		invalidCredentials: "The credentials you entered are incorrect",
		verificationEmail:
			"Due to an internal error, the verification email could not be sent. We are sorry for the inconvenience",
		invalidTwoFactorAuthOtp: "Invalid OTP",
		twoFactorAuthEmail:
			"Due to an internal error, the 2FA email could not be sent. We are sorry for the inconvenience",
		signingIn: "We apologize, but something went wrong while trying to log you into your account",
		OAuthAccountNotLinked: "Email already in use with different provider!",
	},
	success: {
		verificationEmail: MESSAGE_VERIFICATION_EMAIL,
		twoFactorAuthEmail: "Your 2FA email has been successfully sent. Please check your inbox",
		signingIn: "Welcome back! Sign-in successful",
	},
} as const;

export const SIGNUP_MESSAGE = {
	error: {
		notKnown: MESSAGE_NOT_KNOWN,
		invalidFields: MESSAGE_INVALID_FIELDS,
		emailTaken: "The email you entered is already associated with an account",
		usernameTaken:
			"This username is currently in use by another account. Please try a different one",
	},
	success: {
		verificationEmail: MESSAGE_VERIFICATION_EMAIL,
	},
} as const;

export const FORGOT_PASSWORD_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		emailNoExist: "Email does not exist",
		resetEmail: "Failed to send reset email",
	},
	success: {
		resetEmail: "Reset email send",
	},
} as const;

export const RESET_PASSWORD_MESSAGE = {
	error: {
		invalidFields: MESSAGE_INVALID_FIELDS,
		emailNoExist: "Email does not exist",
		resetPassword: "Failed to reset password",
	},
	success: {
		resetPassword: "Password updated. Sign In Now",
	},
} as const;
