import { useEffect, useState } from "react";

/**
 * Custom hook to track the state of a CSS media query.
 *
 * This hook listens to changes in the specified media query and updates
 * the internal state accordingly.
 *
 * @param query - A media query string (e.g., "(max-width: 768px)").
 * @returns A boolean value indicating whether the media query matches the current screen size.
 */
const useMediaQuery = (query: string) => {
	// State to track whether the media query currently matches
	const [value, setValue] = useState(false);

	useEffect(() => {
		/**
		 * Event handler for changes to the media query.
		 * Updates the `value` state based on whether the query matches.
		 *
		 * @param event - The MediaQueryListEvent triggered when the media query state changes.
		 */
		function onChange(event: MediaQueryListEvent) {
			setValue(event.matches);
		}

		// Create a MediaQueryList object based on the query
		const result = matchMedia(query);

		// Add a listener for changes to the media query
		result.addEventListener("change", onChange);

		// Set the initial value of `value` based on the current query match state
		setValue(result.matches);

		// Cleanup the event listener when the component is unmounted or the query changes
		return () => result.removeEventListener("change", onChange);
	}, [query]); // Re-run the effect if the media query string changes

	return value;
};

export default useMediaQuery;
