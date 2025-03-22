/* eslint-disable import/prefer-default-export */

import "server-only";

import ImageKit from "imagekit";

// Creating a new ImageKit client instance using environment variables for configuration.
const imagekitClient = new ImageKit({
	privateKey: process.env.IMAGE_KIT_PRIVATE_KEY as string,
	publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY as string,
	urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT as string,
});

export { imagekitClient };
