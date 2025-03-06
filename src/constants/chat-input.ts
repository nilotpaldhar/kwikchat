// Maximum height of the chat input container (in pixels)
export const MAX_INPUT_CONTAINER_SIZE = 320;

// Vertical padding inside the input container (in pixels)
export const INPUT_CONTAINER_SPACEY = 12;

// Maximum height of the input field, considering padding
export const MAX_INPUT_SIZE = MAX_INPUT_CONTAINER_SIZE - INPUT_CONTAINER_SPACEY * 2;

// Maximum number of characters allowed per message
export const MAX_MESSAGE_CHAR_LENGTH = 500;

// Supported file types for document uploads
export const SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES = ["PDF", "TXT", "DOC", "DOCX"];

// Supported image types for image uploads
export const SUPPORTED_IMAGE_FILE_MESSAGE_TYPES = ["PNG", "JPG", "JPEG", "GIF"];

// Maximum number of images a user can select in the chat input
export const MAX_IMAGE_SELECTION_LIMIT = 10;
