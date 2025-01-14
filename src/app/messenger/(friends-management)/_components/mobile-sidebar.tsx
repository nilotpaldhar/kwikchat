import { Menu } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import FriendsNav from "@/app/messenger/(friends-management)/_components/friends-nav";

const MobileSidebar = () => (
	<Sheet>
		<SheetTrigger asChild>
			<Button
				size="icon"
				variant="outline"
				className="w-auto border-none text-neutral-700 dark:text-neutral-400 dark:hover:bg-surface-dark-600"
			>
				<Menu size={20} />
				<span className="sr-only">Open friends mobile menu</span>
			</Button>
		</SheetTrigger>
		<SheetContent
			side="right"
			className="bg-surface-light-200 px-5 py-4 dark:bg-surface-dark-400 sm:py-6"
			closeClassName="hidden"
		>
			<SheetHeader className="sr-only">
				<SheetTitle>Friends Mobile Navigation</SheetTitle>
				<SheetDescription>Friends Mobile Navigation</SheetDescription>
			</SheetHeader>
			<div>
				<FriendsNav displayMode="mobile" />
			</div>
		</SheetContent>
	</Sheet>
);

export default MobileSidebar;
