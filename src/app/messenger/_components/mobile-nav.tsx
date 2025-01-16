"use client";

import type { LucideIcon } from "lucide-react";

import Link from "next/link";
import StartChatPopover from "@/app/messenger/(chat-features)/_components/start-chat-popover";

import { usePathname } from "next/navigation";
import { MessagesSquare, Users, PhoneCall, SunMoon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/app/messenger/_components/theme-toggle";

import { cn } from "@/utils/general/cn";

// ClassNames
const linkClassNames =
	"flex flex-col items-center space-y-2 text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-8 dark:text-neutral-300";
const linkIconClassNames = "size-4 sm:size-5";
const linkTextClassNames = "text-[10px] font-bold leading-none sm:text-xs";

const NavLink = ({
	href,
	icon: Icon,
	active,
	children,
}: {
	href: string;
	icon: LucideIcon;
	children: React.ReactNode;
	active?: boolean;
}) => (
	<Link
		href={href}
		className={cn(linkClassNames, active && "text-primary-400 dark:text-primary-400")}
	>
		<Icon className={linkIconClassNames} />
		<span className={linkTextClassNames}>{children}</span>
	</Link>
);

const MobileNav = () => {
	const pathname = usePathname();

	return (
		<nav className="flex h-full w-full items-center">
			<ul className="flex flex-1 items-center justify-between">
				<li>
					<NavLink
						icon={MessagesSquare}
						href="/messenger"
						active={
							pathname.startsWith("/messenger/chats") ||
							pathname === "/messenger/open-chat" ||
							pathname === "/messenger"
						}
					>
						Chats
					</NavLink>
				</li>
				<li>
					<NavLink
						icon={Users}
						href="/messenger/friends"
						active={pathname.startsWith("/messenger/friends")}
					>
						Friends
					</NavLink>
				</li>
				<li>
					<StartChatPopover sideOffset={8}>
						<Button size="icon" className="rounded-full shadow shadow-primary-400/25">
							<Plus size={20} />
						</Button>
					</StartChatPopover>
				</li>
				<li>
					<NavLink
						icon={PhoneCall}
						href="/messenger/calls"
						active={pathname.startsWith("/messenger/calls")}
					>
						Calls
					</NavLink>
				</li>
				<li>
					<ThemeToggle side="top" align="end">
						<button type="button" className={linkClassNames}>
							<SunMoon className={linkIconClassNames} />
							<span className={linkTextClassNames}>Theme</span>
						</button>
					</ThemeToggle>
				</li>
			</ul>
		</nav>
	);
};

export default MobileNav;
