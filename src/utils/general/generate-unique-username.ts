import { customAlphabet } from "nanoid";

// Define a custom alphabet for the unique ID generator
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

// Create a nanoid generator with the specified alphabet and length of 10 characters
const nanoid = customAlphabet(alphabet, 10);

/**
 * Generates a unique username based on a given prefix.
 *
 * The function replaces spaces in the prefix with underscores, converts the
 * string to lowercase, and appends a unique 10-character ID using nanoid.
 *
 * @param prefix - The base string (e.g., a user's name) to generate the username from.
 * @returns A unique username in the format: "prefix@uniqueID".
 */
const generateUniqueUsername = (prefix: string) =>
	`${prefix.split(" ").join("_").toLowerCase()}@${nanoid()}`;

export default generateUniqueUsername;
