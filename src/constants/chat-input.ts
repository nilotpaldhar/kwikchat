// Maximum height of the chat input container (in pixels)
export const MAX_INPUT_CONTAINER_SIZE = 320;

// Vertical padding inside the input container (in pixels)
export const INPUT_CONTAINER_SPACEY = 12;

// Maximum height of the input field, considering padding
export const MAX_INPUT_SIZE = MAX_INPUT_CONTAINER_SIZE - INPUT_CONTAINER_SPACEY * 2;

// Maximum number of characters allowed per message
export const MAX_MESSAGE_CHAR_LENGTH = 500;

// Maximum number of characters allowed per message caption
export const MAX_MESSAGE_CAPTION_CHAR_LENGTH = 80;

// Supported file types for document uploads
// NOTE: If adding more file types, update the `DocumentIcon` component accordingly.
export const SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES = ["PDF", "TXT", "DOC", "DOCX"] as const;

// Supported image types for image uploads
export const SUPPORTED_IMAGE_FILE_MESSAGE_TYPES = ["PNG", "JPG", "JPEG"] as const;

// Maximum number of images a user can select in the chat input
export const MAX_IMAGE_SELECTION_LIMIT = 10;
