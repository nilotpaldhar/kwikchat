/* eslint-disable import/prefer-default-export */

import "client-only";

import PusherClient from "pusher-js";

// Creating a new Pusher client instance using environment variables for configuration.
// The client will connect to Pusher to subscribe to channels and receive real-time events.
const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "", {
	cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "ap2",
});

export { pusherClient };
