"use server";

import { signOut } from "@/auth";

async function logout() {
	await signOut({
		redirectTo: "/sign-in",
	});
}

export default logout;
