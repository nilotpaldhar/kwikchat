import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import MobileSidebar from "@/app/(settings)/_components/mobile-sidebar";

interface HeaderProps {
	children: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => (
	<div>
		<header className="fixed inset-0 z-10 h-16 w-full bg-surface-light-100 shadow-header dark:border-b dark:border-neutral-900 dark:bg-surface-dark-600 dark:shadow-none lg:static lg:h-auto lg:shadow-none dark:lg:border-none">
			<div className="flex h-full items-center space-x-3 px-4 md:px-8 lg:space-x-0 lg:px-0">
				<div className="lg:hidden">
					<Button
						className="w-auto border-none dark:hover:bg-surface-dark-600"
						variant="outline"
						size="icon"
						asChild
					>
						<Link href="/messenger">
							<ArrowLeft size={20} />
							<span className="sr-only">Back to messenger</span>
						</Link>
					</Button>
				</div>
				<div className="flex-1">
					<h1 className="text-large xl:heading-4">{children}</h1>
				</div>
				<div className="lg:hidden">
					<MobileSidebar />
				</div>
			</div>
		</header>
	</div>
);

export default Header;
