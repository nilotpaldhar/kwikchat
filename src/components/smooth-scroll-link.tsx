"use client";

interface SmoothScrollLinkProps {
	href: string; // Target section ID (e.g., "#section1")
	offset?: number; // Offset for fixed headers
	onScrollComplete?: () => void; // Callback function after scrolling
	children: React.ReactNode;
	className?: string;
}

const SmoothScrollLink = ({
	href,
	offset = 0,
	onScrollComplete,
	children,
	className,
}: SmoothScrollLinkProps) => {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();

		const targetId = href.replace("#", "");
		const targetElement = document.getElementById(targetId);

		if (!targetElement) return;

		const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - offset;

		window.scrollTo({ top: offsetPosition, behavior: "smooth" });

		// Run callback after scroll completes
		setTimeout(() => {
			if (onScrollComplete) onScrollComplete();
		}, 500);

		window.history.pushState(null, "", `#${targetId}`); // Update URL hash
	};

	return (
		<a href={href} onClick={handleClick} className={className}>
			{children}
		</a>
	);
};

export default SmoothScrollLink;
