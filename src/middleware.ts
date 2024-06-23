import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";
import {
	AUTH_ROUTES,
	PUBLIC_ROUTES,
	API_AUTH_PREFIX,
	DEFAULT_LOGIN_REDIRECT,
} from "@/constants/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
	const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
	const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

	if (isApiAuthRoute) return NextResponse.next();

	if (isAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
	}

	if (isAuthRoute && !isLoggedIn) return NextResponse.next();

	if (!isLoggedIn && !isPublicRoute) {
		return NextResponse.redirect(new URL("/sign-in", nextUrl));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
