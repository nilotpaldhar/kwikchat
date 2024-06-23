import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

const generateUniqueUsername = (prefix: string) =>
	`${prefix.split(" ").join("_").toLowerCase()}@${nanoid()}`;

export default generateUniqueUsername;
