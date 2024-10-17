import DesktopSidebar from "@/app/messenger/_components/desktop-sidebar";
import MessengerDialogProvider from "@/components/providers/messenger-dialog-provider";

interface MessengerLayoutProps {
	children: React.ReactNode;
}

const MessengerLayout = ({ children }: MessengerLayoutProps) => (
	<>
		<MessengerDialogProvider />
		<div className="h-screen overflow-hidden">
			<div className="flex h-full">
				<div className="hidden h-full w-20 overflow-hidden border-r border-neutral-200 shadow-sidebar dark:border-neutral-900 md:block">
					<DesktopSidebar />
				</div>
				<div className="h-full flex-1">{children}</div>
			</div>
		</div>
	</>
);

export default MessengerLayout;
