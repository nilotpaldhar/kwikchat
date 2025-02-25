"use client";

import { Menu, XIcon } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import SiteLogo from "@/components/site-logo";
import { Button } from "@/components/ui/button";

import LoginOrAppLink from "@/app/(marketing)/_components/header-navbar/login-or-app-link";
import NavLinks, { type NavLink } from "@/app/(marketing)/_components/header-navbar/nav-links";
import { useCallback, useState } from "react";

interface MobileMenuProps {
	navLinks: NavLink[];
}

const MobileMenu = ({ navLinks }: MobileMenuProps) => {
	const [open, setOpen] = useState(false);

	const handleScrollComplete = useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<>
			<Button
				size="icon"
				variant="primary"
				onClick={() => setOpen(true)}
				className="size-6 border-transparent bg-transparent p-0 ring-offset-primary-400 hover:bg-transparent focus-visible:ring-neutral-300 dark:border-transparent dark:bg-transparent dark:ring-offset-primary-400 dark:hover:bg-transparent"
			>
				<Menu />
				<span className="sr-only">Open Mobile Menu</span>
			</Button>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent
					side="right"
					className="bg-surface-light-100 p-0 dark:bg-surface-light-100"
					closeClassName="hidden"
				>
					<SheetHeader className="sr-only">
						<SheetTitle>Mobile Menu</SheetTitle>
						<SheetDescription>Mobile Menu</SheetDescription>
					</SheetHeader>
					<div>
						<div className="flex h-16 items-center border-b border-neutral-200 px-3">
							<div className="flex w-full items-center justify-between space-x-3">
								<SiteLogo className="ring-offset-surface-light-100 dark:ring-offset-surface-light-100" />
								<Button
									size="icon"
									variant="outline"
									onClick={() => setOpen(false)}
									className="size-5 border-transparent bg-transparent p-0 text-neutral-700 ring-offset-surface-light-100 hover:bg-transparent dark:border-transparent dark:bg-transparent dark:text-neutral-700 dark:ring-offset-surface-light-100 dark:hover:bg-transparent"
								>
									<XIcon size={20} />
									<span className="sr-only">Close</span>
								</Button>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex-1">
								<nav className="px-3 py-6">
									<NavLinks
										links={navLinks}
										scrollOffset={64}
										onScrollComplete={handleScrollComplete}
										className="flex-col items-start space-x-0 space-y-5 lg:space-x-0"
										linkClassName="text-neutral-900 after:bg-neutral-900 focus-visible:ring-neutral-300 focus-visible:ring-offset-4  ring-offset-white focus-visible:ring-neutral-500"
									/>
								</nav>
							</div>
							<div className="px-3 py-4">
								<LoginOrAppLink
									defaultClassNames={false}
									className="w-full rounded-full ring-offset-surface-light-100 dark:ring-offset-surface-light-100"
								/>
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default MobileMenu;
