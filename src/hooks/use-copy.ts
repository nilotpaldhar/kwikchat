import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import copyTextToClipboard from "@/utils/general/copy-text-to-clipboard";

type UseCopyReturnType = [() => void, boolean, Dispatch<SetStateAction<boolean>>];

/**
 * Custom hook to copy text to the clipboard.
 *
 * Provides a function to copy the provided string, a boolean flag indicating
 * if the text was successfully copied, and a setter function to manually change
 * the copied state.
 *
 * @param str - The string to be copied to the clipboard.
 * @returns A tuple containing:
 *   - handleCopy: A function that copies the text.
 *   - copied: Boolean state indicating whether the text has been successfully copied.
 *   - setCopied: Function to manually set the copied state.
 */
const useCopy = (str: string): UseCopyReturnType => {
	// useRef to store the string that can be copied, allowing it to be updated without re-rendering
	const copyableString = useRef(str);

	// State to track whether the string has been successfully copied
	const [copied, setCopied] = useState(false);

	/**
	 * handleCopy - Function to copy the text to clipboard.
	 * Uses the utility function to copy the current value of the copyable string.
	 * Updates the `copied` state based on the success of the copy operation.
	 */
	const handleCopy = useCallback(() => {
		copyTextToClipboard(copyableString.current).then((copiedString) => setCopied(copiedString));
	}, [copyableString]);

	/**
	 * useEffect to update the copyable string when the input string changes.
	 */
	useEffect(() => {
		copyableString.current = str;
	}, [str]);

	return [handleCopy, copied, setCopied];
};

export default useCopy;
