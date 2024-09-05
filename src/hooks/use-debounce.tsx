import { useEffect, useState } from "react";

/**
 * Custom React hook that debounces a value. This is useful for delaying updates
 * to a value until the user stops typing or interacting for a specified period.
 */
const useDebounce = ({ value, delay = 500 }: { value: string; delay?: number }) => {
	// State to hold the debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set up a timer to update the debounced value after the specified delay
		const timerId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup function to clear the timer if value or delay changes before it completes
		return () => clearTimeout(timerId);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
