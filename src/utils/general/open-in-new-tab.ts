/**
 * Opens a given URL in a new browser tab after validating it.
 *
 * - Ensures the URL is not null or empty.
 * - Validates the URL using the `URL` constructor.
 * - Opens the link in a new tab with security best practices.
 */
const openInNewTab = (url: string | null) => {
	if (!url) return;

	try {
		const validUrl = new URL(url); // Validate URL
		const newTab = window.open(validUrl.toString(), "_blank", "noopener,noreferrer");
		if (newTab) newTab.opener = null; // Security best practice
	} catch (error) {
		console.error("Invalid URL:", url);
	}
};

export default openInNewTab;
