const getRandomDateInLastYear = () => {
	const now = new Date();
	const currentTime = now.getTime();
	const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime();
	const randomTime = new Date(oneYearAgo + Math.random() * (currentTime - oneYearAgo));
	return randomTime;
};

export { getRandomDateInLastYear };
