import "client-only";

const formatJoining = (date: Date) => {
	if (!date) return "Unknown";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export default formatJoining;
