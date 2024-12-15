import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import MobileNav from "@/app/messenger/_components/mobile-nav";
import ChatWelcome from "@/app/messenger/_components/chat-welcome";
import MobileHeader from "@/app/messenger/_components/mobile-header";
import ChatSidePanel from "@/app/messenger/_components/chat-side-panel";
import OnlineFriendsList from "@/app/messenger/_components/online-friends-list";

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
				<div className="hidden h-full md:block">
					<ChatWelcome />
				</div>
				<div className="h-full p-4 sm:p-8 md:hidden">
					<div className="flex flex-col space-y-10">
						<OnlineFriendsList
							classNames={{
								skeleton: "max-w-72 xs:max-w-sm sm:max-w-lg",
								carousel: "max-w-72 xs:max-w-sm sm:max-w-lg",
							}}
						/>
					</div>
				</div>
			</WrapperContent>
			<WrapperFooter className="px-4 sm:px-8 md:hidden">
				<MobileNav />
			</WrapperFooter>
		</WrapperContentZone>
	</Wrapper>
);

export default MessengerRootPage;
