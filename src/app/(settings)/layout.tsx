import DesktopSidebar from "@/app/(settings)/_components/desktop-sidebar";
import CloseSettings from "@/app/(settings)/_components/close-settings";

import { ScrollArea } from "@/components/ui/scroll-area";
import SettingsDialogProvider from "@/components/providers/settings-dialog-provider";

interface SettingsLayoutProps {
	children: React.ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => (
	<>
		<SettingsDialogProvider />
		<div className="h-screen overflow-hidden">
			<div className="grid grid-cols-12">
				<aside className="hidden bg-surface-light-200 dark:bg-surface-dark-400 lg:block lg:col-span-3 xl:col-span-4">
					<ScrollArea className="h-screen">
						<DesktopSidebar />
					</ScrollArea>
				</aside>
				<main className="col-span-full lg:col-span-9 xl:col-span-8">
					<ScrollArea className="h-screen">
						<div className="flex">
							<div className="flex-1 lg:px-10 lg:py-14 lg:max-w-2xl xl:max-w-3xl">{children}</div>
							<div className="hidden lg:block lg:pt-14">
								<CloseSettings />
							</div>
						</div>
					</ScrollArea>
				</main>
			</div>
		</div>
	</>
);

export default SettingsLayout;
