export enum AuthError {
	Configuration = "Configuration",
	AccessDenied = "AccessDenied",
	Verification = "Verification",
	Default = "Default",
}

export enum TokenValidationStatus {
	InvalidToken = "InvalidToken",
	TokenExpired = "TokenExpired",
	InvalidTokenEmail = "InvalidTokenEmail",
	ValidationFailed = "ValidationFailed",
	Default = "Default",
}
