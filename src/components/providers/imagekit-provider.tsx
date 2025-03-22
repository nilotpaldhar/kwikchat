"use client";

import { ImageKitProvider as IKProvider } from "imagekitio-next";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY!;
const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT!;

const ImagekitProvider = ({ children }: { children: React.ReactNode }) => {
	const authenticator = async () => {
		const res = await fetch("/api/imagekit/authenticate");
		if (!res.ok) throw new Error("Failed to authenticate");
		const data = await res.json();
		return data;
	};

	return (
		<IKProvider publicKey={PUBLIC_KEY} urlEndpoint={URL_ENDPOINT} authenticator={authenticator}>
			{children}
		</IKProvider>
	);
};

export default ImagekitProvider;
