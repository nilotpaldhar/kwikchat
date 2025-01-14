"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/utils/general/cn";
import { usePendingFriendRequestsCountQuery } from "@/hooks/tanstack-query/use-friend-request";

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
	overflowCount?: number;
}

const FriendsNav = ({ displayMode = "desktop", overflowCount = 99, ...props }: FriendsNavprops) => {
	const pathname = usePathname();
	const { data } = usePendingFriendRequestsCountQuery();

	const totalPending = data?.data?.pending ?? 0;
	const isOverflowing = totalPending > overflowCount;
	const singleDigit = !isOverflowing && totalPending < 10;

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
									{id === "friends:pending" && totalPending > 0 && (
										<AnimatePresence>
											<motion.div
												className={cn(
													"ml-1.5 flex h-4 min-w-4 items-center justify-center overflow-hidden rounded-full bg-red-600 text-[10px] font-bold leading-none text-white",
													!singleDigit && "px-1"
												)}
												initial={{ opacity: 0, scale: 0 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0 }}
												transition={{ type: "spring" }}
											>
												<motion.div
													initial={{ opacity: 0, y: 100 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 100 }}
													transition={{ type: "spring" }}
													className="flex items-center"
												>
													<span>{isOverflowing ? overflowCount : totalPending}</span>
													{isOverflowing && <span className="text-base leading-none">+</span>}
												</motion.div>
											</motion.div>
										</AnimatePresence>
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
