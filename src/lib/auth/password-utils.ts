import { hashSync, compareSync } from "bcrypt-edge";

/**
 * Hashes a plain text password using bcrypt.
 */
const hashPassword = (password: string): string => {
	const hash = hashSync(password, 10);
	return hash;
};

/**
 * Verifies a plain text password against a hashed password.
 */
const verifyPassword = (password: string, hashedPassword: string): boolean => {
	const isValid = compareSync(password, hashedPassword);
	return isValid;
};

export { hashPassword, verifyPassword };
