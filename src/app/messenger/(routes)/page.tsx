import { Button } from "@/components/ui/button";

import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import MobileNav from "@/app/messenger/_components/mobile-nav";
import MobileHeader from "@/app/messenger/_components/mobile-header";
import ChatSidePanel from "@/app/messenger/_components/chat-side-panel";

const MessengerRootPage = () => (
	<Wrapper>
		<WrapperSidePanel>
			<ChatSidePanel />
		</WrapperSidePanel>
		<WrapperContentZone>
			<WrapperHeader className="border-b border-neutral-200 px-4 dark:border-neutral-900 sm:px-8 md:hidden">
				<MobileHeader />
			</WrapperHeader>
			<WrapperContent className="md:m-0 md:h-screen md:overflow-hidden">
				<div className="hidden h-full items-center justify-center md:flex">
					<Button>Open Chat</Button>
				</div>
			</WrapperContent>
			<WrapperFooter className="px-4 sm:px-8 md:hidden">
				<MobileNav />
			</WrapperFooter>
		</WrapperContentZone>
	</Wrapper>
);

export default MessengerRootPage;
