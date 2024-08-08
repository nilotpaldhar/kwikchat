import Sidebar from "@/app/(messenger)/_components/sidebar";

interface MessengerLayoutProps {
	children: React.ReactNode;
}

const MessengerLayout = ({ children }: MessengerLayoutProps) => (
	<div className="h-screen overflow-hidden">
		<div className="flex h-full">
			<aside className="flex-1 max-w-20 border-r border-neutral-200">
				<Sidebar />
			</aside>
			<div className="flex-1 max-w-[360px] border-r border-neutral-200" />
			<main className="flex-1">{children}</main>
		</div>
	</div>
);

export default MessengerLayout;
