import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user/user-avatar";
import ProfileOverview from "@/components/user/profile-overview";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Pencil } from "lucide-react";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";

const ProfilePopup = async () => {
	const session = await getSession();
	if (!session?.user.id) return null;

	const user = await getCachedUserById(session?.user.id);
	if (!user || !user?.username) return null;

	const fallback = user.name ? user.name.charAt(0) : user.username.charAt(0);

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button size="icon" className="h-12 w-12 bg-transparent hover:bg-transparent">
					<UserAvatar src={user.avatar} fallback={fallback.toUpperCase()} status="online" />
					<span className="sr-only">Open Profile</span>
				</Button>
			</HoverCardTrigger>
			<HoverCardContent
				className="w-[340px] p-0 shadow-[0_8px_16px_rgba(0,0,0,0.1)] rounded-xl border-none overflow-hidden"
				side="right"
				sideOffset={8}
				align="end"
				alignOffset={8}
			>
				<div className="relative">
					<ProfileOverview user={user} copyableUsername showLogout />
					<Link
						href="/account-profile"
						className="absolute top-3 right-3 flex items-center justify-center size-7 rounded-full bg-black/20 text-white transition hover:bg-black/30"
					>
						<Pencil size={12} />
						<span className="sr-only">Edit Profile</span>
					</Link>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default ProfilePopup;
