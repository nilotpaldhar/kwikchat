import { useEffect, useState } from "react";
import debounce from "@/utils/general/debounce";

// Interface defining the params for the useChatAreaScroll hook
interface ChatAreaScrollParams {
	chatAreaRef: React.RefObject<HTMLDivElement | null>; // Reference to the chat container
	chatAreaEndRef: React.RefObject<HTMLDivElement | null>; // Reference to the end of the chat area (for auto-scroll)
	count: number; // Number of messages (triggers re-render when messages change)
	shouldLoadMore?: boolean; // Flag to determine if more messages should be loaded on scroll to top
	autoScrollThreshold?: number; // Optional threshold (in px) for triggering auto-scroll, default is 500px
	loadMore: () => void; // Function to load more messages when the user scrolls to the top
}

/**
 * Custom hook to handle chat area scrolling behavior
 */
const useChatAreaScroll = ({
	chatAreaRef,
	chatAreaEndRef,
	count,
	shouldLoadMore = false,
	autoScrollThreshold = 500,
	loadMore,
}: ChatAreaScrollParams) => {
	const [hasInitialized, setHasInitialized] = useState(false);

	// Effect to handle scrolling to load more messages when the user scrolls to the top of the chat area
	useEffect(() => {
		const container = chatAreaRef.current;
		if (!container) return () => {};

		// Handle scroll event with debounce to avoid excessive calls to 'loadMore'
		const handleScroll = debounce(() => {
			const scrollTop = container.scrollTop;
			if (scrollTop === 0 && shouldLoadMore) loadMore(); // Trigger load more when scrolled to top
		}, 200);

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [chatAreaRef, shouldLoadMore, loadMore]);

	// Effect to handle auto-scrolling to the bottom of the chat when new messages are loaded
	useEffect(() => {
		const container = chatAreaRef.current;
		const bottomDiv = chatAreaEndRef?.current;

		// Function to determine if auto-scroll to the bottom should occur
		const shouldAutoScroll = () => {
			// If the chat has not been initialized yet, auto-scroll on the first render
			if (!hasInitialized && bottomDiv) {
				setHasInitialized(true);
				return true;
			}

			if (!container) return false; // If the container is not defined, don't auto-scroll

			// Calculate the distance from the current scroll position to the bottom of the chat area
			const distanceFromBottom =
				container.scrollHeight - container.scrollTop - container.clientHeight;

			return distanceFromBottom <= autoScrollThreshold;
		};

		if (shouldAutoScroll()) {
			setTimeout(() => {
				chatAreaEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100); // Smooth scroll to the latest message
		}
	}, [hasInitialized, chatAreaRef, chatAreaEndRef, autoScrollThreshold, count]);
};

export default useChatAreaScroll;
