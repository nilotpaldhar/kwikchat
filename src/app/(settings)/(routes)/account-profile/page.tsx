import Header from "@/app/(settings)/_components/header";
import SettingsContent from "@/app/(settings)/_components/settings-content";
import ProfileManager from "@/app/(settings)/_components/profile-manager";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";

const AccountProfile = async () => {
	const session = await getSession();

	if (!session?.user.id) return null;

	const user = await getCachedUserById(session?.user.id);

	if (!user) return null;
	const { password, image, ...rest } = user;

	return (
		<>
			<Header>Profile</Header>
			<SettingsContent>
				<ProfileManager user={rest} />
			</SettingsContent>
		</>
	);
};

export default AccountProfile;
