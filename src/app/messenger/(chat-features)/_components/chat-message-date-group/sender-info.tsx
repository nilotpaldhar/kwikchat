import type { UserProfile } from "@/types";

import UserAvatar from "@/components/user/user-avatar";

interface SenderInfoProps {
	sender: UserProfile;
}

const SenderInfo = ({ sender }: SenderInfoProps) => {
	const { name, username, displayName, avatar } = sender;
	const fallback = name ? name[0] : username?.[0];

	return (
		<div className="select-none">
			<div className="flex items-start space-x-2">
				<UserAvatar src={avatar} fallback={fallback?.toUpperCase() as string} />
				<div className="pt-1.5 font-medium leading-6">{displayName ?? username}</div>
			</div>
		</div>
	);
};
export default SenderInfo;
