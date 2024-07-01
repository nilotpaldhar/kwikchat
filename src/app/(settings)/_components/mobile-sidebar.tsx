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
import SettingsNav from "@/app/(settings)/_components/settings-nav";

const MobileSidebar = () => (
	<Sheet>
		<SheetTrigger asChild>
			<Button
				className="border-none w-auto dark:hover:bg-surface-dark-600"
				variant="outline"
				size="icon"
			>
				<Menu size={20} />
				<span className="sr-only">Open mobile menu</span>
			</Button>
		</SheetTrigger>
		<SheetContent
			side="right"
			className="bg-surface-light-200 dark:bg-surface-dark-400 px-5 py-4 sm:py-6"
			closeClassName="hidden"
		>
			<SheetHeader className="sr-only">
				<SheetTitle>Mobile Navigation</SheetTitle>
				<SheetDescription>Mobile Navigation</SheetDescription>
			</SheetHeader>
			<div>
				<SettingsNav />
			</div>
		</SheetContent>
	</Sheet>
);

export default MobileSidebar;
