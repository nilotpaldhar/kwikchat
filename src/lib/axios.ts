import axiosStandard, { AxiosError } from "axios";

const axios = axiosStandard.create();

axios.defaults.baseURL = "/api";

/**
 * Utility function to handle Axios errors.
 *
 * @param error - The caught error from an Axios request.
 * @returns A formatted error message.
 */
export const handleAxiosError = (error: unknown): string => {
	if (error instanceof AxiosError) {
		return error.response?.data.message ?? "An unexpected error occurred. Please try again.";
	}
	return "An unknown error occurred.";
};

export default axios;
