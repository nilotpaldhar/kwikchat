import {
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import MobileNav from "@/app/messenger/_components/mobile-nav";

import ChatWelcome from "@/app/messenger/(chat-features)/_components/chat-welcome";
import MobileHeader from "@/app/messenger/(chat-features)/_components/mobile-header";
import ConversationsList from "@/app/messenger/(chat-features)/_components/conversations-list";
import OnlineFriendsList from "@/app/messenger/(chat-features)/_components/online-friends-list";

const MessengerRootPage = () => (
	<WrapperContentZone>
		<WrapperHeader className="border-b border-neutral-200 px-4 dark:border-neutral-900 sm:px-8 md:hidden">
			<MobileHeader />
		</WrapperHeader>
		<WrapperContent className="md:m-0 md:h-screen md:overflow-hidden">
			<div className="hidden h-full md:block">
				<ChatWelcome />
			</div>
			<div className="h-full py-4 sm:p-8 md:hidden">
				<div className="flex flex-col space-y-10">
					<OnlineFriendsList
						className="px-5"
						classNames={{
							skeleton: "max-w-72 xs:max-w-sm sm:max-w-lg",
							carousel: "max-w-72 xs:max-w-sm sm:max-w-lg",
						}}
					/>
					<ConversationsList
						classNames={{
							filter: "px-5",
							skeleton: "px-5",
							errorAlert: "px-5",
							conversationTile: "px-5",
						}}
					/>
				</div>
			</div>
		</WrapperContent>
		<WrapperFooter className="px-4 sm:px-8 md:hidden">
			<MobileNav />
		</WrapperFooter>
	</WrapperContentZone>
);

export default MessengerRootPage;
