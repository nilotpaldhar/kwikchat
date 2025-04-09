const debounce = (callback: () => void, wait = 3000) => {
	let timeout: NodeJS.Timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(callback, wait);
	};
};

export default debounce;
