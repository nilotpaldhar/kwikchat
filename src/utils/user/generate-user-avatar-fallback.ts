import type { UserProfile, UserWithoutPassword } from "@/types";

/**
 * Generates a fallback avatar character based on user information.
 */
const generateUserAvatarFallback = ({ user }: { user: UserWithoutPassword | UserProfile }) => {
	// Destructure name, displayName, and username from the user object.
	const { name, displayName, username } = user;

	// If displayName exists, return the first character in uppercase.
	if (displayName) return displayName.charAt(0).toUpperCase();

	// If username exists, return the first character in uppercase.
	if (username) return username.charAt(0).toUpperCase();

	// If name exists, return the first character in uppercase.
	if (name) return name.charAt(0).toUpperCase();

	// If no valid properties are available, return a default "?" character.
	return "?";
};

export default generateUserAvatarFallback;
