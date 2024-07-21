"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Divider } from "@/components/ui/divider";
import LogoutConfirm from "@/components/auth/logout-confirm";

import useSettingsLinks from "@/hooks/use-settings-links";
import { cn } from "@/utils/general/cn";

const SettingsNav = () => {
	const links = useSettingsLinks();
	const linkClassName = `flex items-center justify-between w-full px-2 py-1 font-medium text-neutral-700 dark:text-neutral-300 ring-offset-surface-light-200 dark:ring-offset-surface-dark-400 rounded-md transition-colors hover:bg-neutral-200/30 dark:hover:bg-surface-dark-300/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-600`;

	return (
		<nav className="flex flex-col space-y-3">
			<ul className="flex flex-col space-y-2">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							className={cn(
								linkClassName,
								link.active &&
									`text-neutral-900 font-bold bg-neutral-200 hover:bg-neutral-200 dark:bg-surface-dark-300 dark:hover:bg-surface-dark-300`
							)}
							href={link.href}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
			<Divider type="solid" className="before:border-neutral-300 dark:before:border-neutral-800" />
			<ul>
				<li>
					<LogoutConfirm>
						<button type="submit" className={linkClassName}>
							<span>Log Out</span>
							<LogOut size={16} />
						</button>
					</LogoutConfirm>
				</li>
			</ul>
		</nav>
	);
};

export default SettingsNav;
