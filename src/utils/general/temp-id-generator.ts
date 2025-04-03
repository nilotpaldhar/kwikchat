import { nanoid } from "nanoid";

// Custom prefix for temporary IDs
const TEMP_ID_PREFIX = "temp_";

/**
 * Generate a temporary ID using nanoid.
 */
const generateTempId = (): string => `${TEMP_ID_PREFIX}${nanoid()}`;

/**
 * Check if a given ID is a temporary ID.
 */
const isTempId = (id: string): boolean => id.startsWith(TEMP_ID_PREFIX);

export { generateTempId, isTempId };
