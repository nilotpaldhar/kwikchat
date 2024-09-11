"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import UserAvatar from "@/components/user/user-avatar";
import ProfileOverview from "@/components/user/profile-overview";

import useIsTouchDevice from "@/hooks/use-is-touch-device";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

interface ProfilePopupProps {
	side?: "bottom" | "top" | "right" | "left";
	sideOffset?: number;
	align?: "center" | "end" | "start";
	alignOffset?: number;
}

const ProfilePopup = ({
	side = "right",
	sideOffset = 8,
	align = "end",
	alignOffset = 8,
}: ProfilePopupProps) => {
	const isTouchDevice = useIsTouchDevice();

	const { data, isLoading, isError } = useCurrentUser();
	const user = data?.data;

	if (isLoading) return <Skeleton className="size-12 rounded-full" />;

	if (isError || !user || !user.username) return null;

	const fallback = user.name ? user.name.charAt(0) : user.username.charAt(0);

	if (isTouchDevice)
		return (
			<Button asChild size="icon" className="h-12 w-12 bg-transparent hover:bg-transparent">
				<Link href="/account-profile">
					<UserAvatar src={user.avatar} fallback={fallback.toUpperCase()} />
					<span className="sr-only">Open Profile</span>
				</Link>
			</Button>
		);

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button size="icon" className="h-12 w-12 bg-transparent hover:bg-transparent">
					<UserAvatar src={user.avatar} fallback={fallback.toUpperCase()} />
					<span className="sr-only">Open Profile</span>
				</Button>
			</HoverCardTrigger>
			<HoverCardContent
				className="w-[340px] overflow-hidden rounded-xl border-none p-0 shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
			>
				<div className="relative">
					<ProfileOverview user={user} copyableUsername showLogout />
					<Link
						href="/account-profile"
						className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/30"
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
