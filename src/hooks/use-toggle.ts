import { useState, useCallback } from "react";

const useToggle = (initialValue: boolean = true): [boolean, () => void] => {
	const [value, setValue] = useState<boolean>(initialValue);

	/** useCallback ensures that the toggle function has a stable reference */
	const toggle = useCallback(() => {
		setValue((prevValue) => !prevValue);
	}, []);

	return [value, toggle];
};

export default useToggle;
