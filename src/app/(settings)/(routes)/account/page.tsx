import Header from "@/app/(settings)/_components/header";
import SettingsContent from "@/app/(settings)/_components/settings-content";
import ProfileDetails from "@/app/(settings)/_components/profile-details";
import ToggleTheme from "@/app/(settings)/_components/toggle-theme";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";

const Account = async () => {
	const session = await getSession();

	if (!session?.user.id) return null;

	const user = await getCachedUserById(session?.user.id);
	const isOAuth = !user?.password;

	if (!user) return null;

	return (
		<>
			<Header>My Account</Header>
			<SettingsContent>
				<div className="flex flex-col space-y-12">
					<ProfileDetails user={user} isOAuth={isOAuth} />
					<ToggleTheme />
				</div>
			</SettingsContent>
		</>
	);
};

export default Account;
