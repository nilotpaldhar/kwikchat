"use client";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import ProfileBio from "@/components/user/profile-bio";
import LogoutConfirm from "@/components/auth/logout-confirm";
import { Block, BlockTitle, BlockDescription } from "@/components/ui/block";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Copy, Clock, LogOut, ChevronRight } from "lucide-react";

import useCopy from "@/hooks/use-copy";
import { cn } from "@/utils/general/cn";

interface ProfileInfoProps {
	name: string;
	username: string;
	email: string;
	about?: string | null;
	joiningDate: string;
	copyableUsername?: boolean;
	showLogout?: boolean;
	className?: string;
}

const ProfileInfo = ({
	name,
	username,
	email,
	about,
	joiningDate,
	copyableUsername = false,
	showLogout = false,
	className,
}: ProfileInfoProps) => {
	const [copyUsername, copiedUsername, setCopiedUsername] = useCopy(username);

	const handleCopyUsername = () => {
		copyUsername();
		setTimeout(() => setCopiedUsername(false), 5000);
	};

	return (
		<div className={cn("flex flex-col space-y-4", className)}>
			<div className="flex items-start justify-between">
				<Block>
					<BlockTitle className="text-base font-semibold leading-7 capitalize">
						<span className="block max-w-52 truncate">{name}</span>
					</BlockTitle>
					<BlockDescription className="text-xs font-medium leading-3">
						&#64;{username}
					</BlockDescription>
				</Block>

				{copyableUsername && (
					<TooltipProvider>
						<Tooltip open={copiedUsername}>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="w-max h-max p-0 text-neutral-500 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent border-none"
									onClick={() => handleCopyUsername()}
								>
									<Copy size={18} />
									<span className="sr-only">Copy Username</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent className="bg-primary-400 text-white dark:bg-primary-400 dark:text-white">
								<p className="text-xs font-medium">Copied!</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
			<Divider type="solid" className="before:border-neutral-300" />
			<div className="flex flex-col space-y-5">
				<Block className="space-y-0.5">
					<BlockTitle>Email</BlockTitle>
					<BlockDescription className="text-xs leading-3">{email}</BlockDescription>
				</Block>
				{about && (
					<Block className="space-y-0.5">
						<BlockTitle>About Me</BlockTitle>
						<BlockDescription className="text-xs leading-4">
							<ProfileBio bio={about} />
						</BlockDescription>
					</Block>
				)}
				<Block className="space-y-0.5">
					<BlockTitle>Member Since</BlockTitle>
					<BlockDescription className="flex items-center space-x-1 text-xs leading-3">
						<Clock size={12} />
						<span>{joiningDate}</span>
					</BlockDescription>
				</Block>
			</div>
			{showLogout && (
				<>
					<Divider type="solid" className="before:border-neutral-300" />
					<div>
						<LogoutConfirm>
							<Button
								variant="outline"
								className="w-full px-0 py-1 justify-start space-x-2 h-auto bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent border-none"
							>
								<LogOut size={16} />
								<span className="block flex-1 text-xs text-left font-semibold">Logout</span>
								<ChevronRight size={16} />
							</Button>
						</LogoutConfirm>
					</div>
				</>
			)}
		</div>
	);
};

export default ProfileInfo;
