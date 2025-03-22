/* eslint-disable import/prefer-default-export */

import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
	privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
	publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY!,
	urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT!,
});

export async function GET() {
	try {
		const authParams = imagekit.getAuthenticationParameters();
		return NextResponse.json(authParams);
	} catch (error) {
		return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 });
	}
}
