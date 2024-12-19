import { Wrapper, WrapperSidePanel } from "@/app/messenger/_components/wrapper";
import MessengerDialogProvider from "@/components/providers/messenger-dialog-provider";
import ChatSidePanel from "@/app/messenger/(chat-features)/_components/chat-side-panel";

interface MessengerLayoutProps {
	children: React.ReactNode;
}

const ChatFeaturesLayout = ({ children }: MessengerLayoutProps) => (
	<>
		<MessengerDialogProvider />
		<Wrapper className="overflow-hidden">
			<WrapperSidePanel className="bg-surface-light-100 dark:bg-surface-dark-600">
				<ChatSidePanel />
			</WrapperSidePanel>
			{children}
		</Wrapper>
	</>
);

export default ChatFeaturesLayout;
