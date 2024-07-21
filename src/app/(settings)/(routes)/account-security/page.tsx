import Header from "@/app/(settings)/_components/header";
import SettingsContent from "@/app/(settings)/_components/settings-content";
import UpdatePassword from "@/app/(settings)/_components/update-password";
import ToggleTwoFactorAuth from "@/app/(settings)/_components/toggle-two-factor-auth";

import { unstable_cache as cache } from "next/cache";
import { getSession } from "@/data/auth/session";
import { getUserById } from "@/data/user";

const getCachedUser = cache(async (id: string) => getUserById(id, true), ["get-user"]);

const AccountSecurity = async () => {
	const session = await getSession();

	if (!session?.user.id) return null;

	const user = await getCachedUser(session?.user.id);
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
