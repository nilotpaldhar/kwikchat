import "client-only";
import axios from "axios";

/**
 * Downloads a file from a given URL.
 */
const downloadFile = async ({
	url,
	filename = "downloaded_file",
}: {
	url: string;
	filename?: string;
}): Promise<void> => {
	try {
		// Send a GET request to fetch the file as a binary Blob
		const response = await axios.get<Blob>(url, { responseType: "blob" });

		// Ensure the response contains data
		if (!response.data) throw new Error("File download failed: No data received");

		// Create a temporary URL for the Blob
		const blobUrl = window.URL.createObjectURL(response.data);

		// Create a temporary anchor element to trigger the download
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = filename; // Set the desired file name
		document.body.appendChild(a);
		a.click(); // Simulate a user click to start the download
		document.body.removeChild(a); // Remove the element from the DOM

		// Revoke the Blob URL to free up memory
		window.URL.revokeObjectURL(blobUrl);
	} catch (error) {
		// Check if the error is an Axios error and extract a meaningful message
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || "File download failed");
		} else {
			throw new Error("An unknown error occurred while downloading the file");
		}
	}
};

export default downloadFile;
