import type { Metadata } from "next";

import Header from "@/app/(settings)/_components/header";
import SettingsContent from "@/app/(settings)/_components/settings-content";
import UpdatePassword from "@/app/(settings)/_components/update-password";
import ToggleTwoFactorAuth from "@/app/(settings)/_components/toggle-two-factor-auth";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";

export const metadata: Metadata = {
	title: "Account Security",
	description:
		"Manage your password settings and enhance account protection with two-factor authentication.",
};

const AccountSecurity = async () => {
	const session = await getSession();

	if (!session?.user.id) return null;

	const user = await getCachedUserById(session?.user.id);
	const isOAuth = !user?.password;

	if (!user) return null;

	return (
		<>
			<Header>Safety & Security</Header>
			<SettingsContent>
				<div className="flex flex-col space-y-12 sm:max-w-lg">
					<UpdatePassword disabled={isOAuth} />
					<ToggleTwoFactorAuth
						disabled={isOAuth}
						twoFactorAuthEnabled={user.userSettings?.twoFactorEnabled}
					/>
				</div>
			</SettingsContent>
		</>
	);
};

export default AccountSecurity;
