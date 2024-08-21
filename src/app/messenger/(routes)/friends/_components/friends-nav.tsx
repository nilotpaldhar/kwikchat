"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/general/cn";

type DisplayMode = "desktop" | "mobile";

// Navigation Links
const NAV_LINKS = [
	{
		id: "friends:all",
		href: "/messenger/friends",
		label: "All",
	},
	{
		id: "friends:online",
		href: "/messenger/friends/online",
		label: "Online",
	},
	{
		id: "friends:pending",
		href: "/messenger/friends/pending",
		label: "Pending",
	},
	{
		id: "friends:blocked",
		href: "/messenger/friends/blocked",
		label: "Blocked",
	},
	{
		id: "friends:new",
		href: "/messenger/friends/new",
		label: "Add New",
	},
];

interface FriendsNavLinkProps {
	displayMode?: DisplayMode;
	href?: string;
	active?: boolean;
	children: React.ReactNode;
	className?: string;
}

const FriendsNavLink = ({
	displayMode = "desktop",
	href = "#",
	children,
	className,
	active = false,
}: FriendsNavLinkProps) => (
	<Link
		href={href}
		className={cn(
			"flex items-center whitespace-nowrap rounded-md text-sm font-medium leading-6 text-neutral-700 ring-offset-surface-light-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2",
			displayMode === "desktop" &&
				"justify-center bg-surface-light-200 px-3 py-1.5 dark:bg-surface-dark-500 dark:text-neutral-300",
			displayMode === "mobile" && "justify-between px-2 py-1 dark:text-neutral-300",
			active &&
				displayMode === "desktop" &&
				"bg-primary-400 text-white focus-visible:ring-primary-300 dark:bg-primary-400 dark:text-white",
			active &&
				displayMode === "mobile" &&
				"bg-surface-light-300 text-neutral-900 focus-visible:ring-neutral-500 dark:bg-surface-dark-300 dark:text-neutral-200",
			className
		)}
	>
		{children}
		{displayMode === "mobile" && <ChevronRight size={12} />}
	</Link>
);

interface FriendsNavprops extends React.HTMLAttributes<HTMLDivElement> {
	displayMode?: DisplayMode;
}

const FriendsNav = ({ displayMode = "desktop", ...props }: FriendsNavprops) => {
	const pathname = usePathname();

	return (
		<nav {...props}>
			<ul
				className={cn(
					"flex",
					displayMode === "desktop" && "items-center space-x-5",
					displayMode === "mobile" && "flex-col space-y-2"
				)}
			>
				{NAV_LINKS.map(({ id, href, label }) => (
					<li key={id}>
						<FriendsNavLink href={href} active={pathname === href} displayMode={displayMode}>
							{id === "friends:pending" ? (
								<div className="flex items-center">
									{label}
									{id === "friends:pending" && (
										<span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold leading-none text-white">
											5
										</span>
									)}
								</div>
							) : (
								label
							)}
						</FriendsNavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default FriendsNav;
