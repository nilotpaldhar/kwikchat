"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { MessagesSquare, Users, PhoneCall, Settings } from "lucide-react";

import { cn } from "@/utils/general/cn";

interface DesktopNavLinkProps {
	icon: LucideIcon;
	href: string;
	srText?: string;
	active?: boolean;
	className?: string;
}

const DesktopNavLink: React.FC<DesktopNavLinkProps> = ({
	icon: Icon,
	href,
	active,
	srText,
	className,
}) => (
	<Link
		href={href}
		className={cn(
			"relative flex h-10 w-full items-center justify-center text-neutral-700 transition duration-300 after:absolute after:bottom-0 after:left-0 after:top-0 after:w-1 after:scale-0 after:bg-transparent after:transition-all after:duration-300 hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-0 dark:text-neutral-300",
			active &&
				"bg-surface-light-200 text-primary-400 after:scale-100 after:bg-primary-400 dark:bg-surface-dark-500",
			className
		)}
	>
		<Icon size={20} />
		<span className="sr-only">{srText}</span>
	</Link>
);

const DesktopNav = () => {
	const pathname = usePathname();

	return (
		<ul className="flex flex-col space-y-6">
			<li>
				<DesktopNavLink
					href="/messenger/chats"
					icon={MessagesSquare}
					srText="Chats"
					active={pathname.startsWith("/messenger/chats") || pathname === "/messenger"}
				/>
			</li>
			<li>
				<DesktopNavLink
					href="/messenger/friends"
					icon={Users}
					srText="Friends"
					active={pathname.startsWith("/messenger/friends")}
				/>
			</li>
			<li>
				<DesktopNavLink
					href="/messenger/calls"
					icon={PhoneCall}
					srText="Calls"
					active={pathname.startsWith("/messenger/calls")}
				/>
			</li>
			<li>
				<DesktopNavLink href="/account" icon={Settings} srText="Settings" />
			</li>
		</ul>
	);
};

export default DesktopNav;
