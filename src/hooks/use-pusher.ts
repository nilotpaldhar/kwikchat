/* eslint-disable consistent-return */

import { useCallback, useEffect } from "react";
import { pusherClient } from "@/lib/pusher/client";

/**
 * Custom hook for subscribing to Pusher events.
 *
 * @param channelId - The ID used to subscribe to the Pusher channel.
 * @param eventName - The name of the Pusher event to listen for.
 * @param callback - The function to execute when the event is received.
 */
const usePusher = <T>(
	channelId: string | undefined,
	eventName: string,
	callback: (data?: T) => void
) => {
	// Memoize the callback function to prevent unnecessary effect re-runs
	const stableCallback = useCallback(callback, [callback]);

	useEffect(() => {
		if (!channelId) return;

		const channel = pusherClient.subscribe(channelId);
		channel.bind(eventName, stableCallback);

		// Cleanup on unmount or when channelId changes
		return () => {
			channel.unbind(eventName);
			pusherClient.unsubscribe(channelId);
		};
	}, [channelId, eventName, stableCallback]);
};

export default usePusher;
