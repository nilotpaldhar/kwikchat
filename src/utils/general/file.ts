export interface FileDetails {
	fileName: string;
	fileType: string;
	fileSize: string;
}

/**
 * Truncates a file name to prevent overflow, keeping the start and end visible.
 * Example: "verylongfilenameexample.pdf" → "verylongfi...xample.pdf"
 */
const truncateFileName = (fileName: string, maxLength = 20): string => {
	// Return original file name if it's within the limit
	if (fileName.length <= maxLength) return fileName;

	// Extract file extension (e.g., "pdf")
	const extension = fileName.split(".").pop() || "";

	// Remove the extension from the file name
	const nameWithoutExt = fileName.slice(0, -(extension.length + 1)); // Remove extension

	// Determine the number of visible characters on both sides
	const visibleChars = Math.floor((maxLength - 3) / 2);

	// Construct the truncated file name with ellipsis
	return `${nameWithoutExt.slice(0, visibleChars)}...${nameWithoutExt.slice(-visibleChars)}.${extension}`;
};

/**
 * Formats a file size into a human-readable string (B, KB, MB, GB, TB).
 */
const formatFileSize = (size: number): string => {
	const units = ["B", "KB", "MB", "GB", "TB"];
	const unitIndex = Math.floor(Math.log2(size) / 10) || 0;
	const formattedSize = (size / 1024 ** unitIndex).toFixed(2);

	return `${formattedSize} ${units[unitIndex]}`;
};

/**
 * Extracts details from a File object.
 */
const getFileDetails = (file: File): FileDetails => {
	const fileName = file.name;
	const fileType = file.name.split(".").pop()?.toUpperCase() || "UNKNOWN";
	const fileSize = formatFileSize(file.size);

	return { fileName, fileType, fileSize };
};

export { truncateFileName, formatFileSize, getFileDetails };
