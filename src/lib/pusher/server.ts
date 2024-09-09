/* eslint-disable import/prefer-default-export */

import "server-only";

import PusherServer from "pusher";

// Creating a new Pusher server instance using environment variables
// for configuration. Pusher is used for real-time communication such as
// broadcasting events to connected clients.
const pusherServer = new PusherServer({
	// The app ID of the Pusher application, retrieved from environment variables.
	appId: process.env.PUSHER_APP_ID!,

	// The public key used to authenticate client-side connections to Pusher.
	key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,

	// The public key used to authenticate client-side connections to Pusher.
	secret: process.env.PUSHER_APP_SECRET!,

	// The cluster where your Pusher application is hosted, defaulting to "ap2" if not provided.
	cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "ap2",

	// Enabling TLS to secure the connections between the server and Pusher.
	useTLS: true,
});

export { pusherServer };
