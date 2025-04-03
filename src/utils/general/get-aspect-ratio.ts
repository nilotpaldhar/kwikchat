type Orientation = "horizontal" | "vertical" | "square";

/**
 * Determines the orientation of an image based on its width and height.
 */
const getOrientation = ({ width, height }: { width: number; height: number }): Orientation => {
	if (width > height) return "horizontal";
	if (width < height) return "vertical";
	return "square";
};

/**
 * Calculates the aspect ratio of an image and determines its orientation.
 */
const getAspectRatio = ({
	width,
	height,
}: {
	width: number;
	height: number;
}): { aspectRatio: string; orientation: Orientation } => {
	/**
	 * Computes the Greatest Common Divisor (GCD) using the Euclidean algorithm.
	 * This helps simplify the aspect ratio to its smallest form.
	 */
	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

	// Get the greatest common divisor to simplify the aspect ratio
	const divisor = gcd(width, height);
	const aspectWidth = width / divisor;
	const aspectHeight = height / divisor;

	return {
		aspectRatio: `${aspectWidth}/${aspectHeight}`,
		orientation: getOrientation({ width, height }),
	};
};

export { getAspectRatio, getOrientation };
