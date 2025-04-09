import { useState, useCallback } from "react";

/**
 * Custom hook to toggle a boolean value.
 *
 * Provides a boolean state and a function to toggle its value between `true` and `false`.
 *
 * @param initialValue - The initial boolean value, defaults to `true`.
 * @returns A tuple containing:
 *   - `value`: The current boolean state.
 *   - `toggle`: A function to toggle the value between `true` and `false`.
 */
const useToggle = (initialValue = true): [boolean, () => void] => {
	// State to store the current boolean value
	const [value, setValue] = useState<boolean>(initialValue);

	/**
	 * toggle - Function to toggle the boolean value.
	 *
	 * The `useCallback` hook is used to memoize the toggle function so that
	 * it has a stable reference and doesn't get recreated on each render.
	 */
	const toggle = useCallback(() => {
		setValue((prevValue) => !prevValue); // Invert the previous boolean state
	}, []);

	return [value, toggle];
};

export default useToggle;
