import { useState, useEffect } from "react";

/**
 * Custom React hook to detect if the user's device is a touch device.
 */
const useIsTouchDevice = () => {
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		const checkTouchDevice = () => {
			// Check if the device supports touch events
			const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
			setIsTouchDevice(isTouch);
		};

		checkTouchDevice(); // Check on initial mount

		// Optional: Add a resize event listener to detect changes in device capabilities
		window.addEventListener("resize", checkTouchDevice);

		// Clean up the event listener
		return () => {
			window.removeEventListener("resize", checkTouchDevice);
		};
	}, []);

	return isTouchDevice;
};

export default useIsTouchDevice;
