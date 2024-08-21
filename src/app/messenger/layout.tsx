import DesktopSidebar from "@/app/messenger/_components/desktop-sidebar";

interface MessengerLayoutProps {
	children: React.ReactNode;
}

const MessengerLayout = ({ children }: MessengerLayoutProps) => (
	<div className="h-screen overflow-hidden">
		<div className="flex h-full">
			<div className="hidden h-full w-20 overflow-hidden border-r border-transparent shadow-sidebar dark:border-neutral-900 md:block">
				<DesktopSidebar />
			</div>
			<div className="h-full flex-1">{children}</div>
		</div>
	</div>
);

export default MessengerLayout;
