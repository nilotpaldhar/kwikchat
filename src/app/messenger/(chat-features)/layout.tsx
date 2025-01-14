import { Wrapper, WrapperSidePanel } from "@/app/messenger/_components/wrapper";
import ChatSidePanel from "@/app/messenger/(chat-features)/_components/chat-side-panel";

interface ChatFeaturesLayoutProps {
	children: React.ReactNode;
}

const ChatFeaturesLayout = ({ children }: ChatFeaturesLayoutProps) => (
	<Wrapper className="overflow-hidden">
		<WrapperSidePanel className="bg-surface-light-100 dark:bg-surface-dark-600">
			<ChatSidePanel />
		</WrapperSidePanel>
		{children}
	</Wrapper>
);

export default ChatFeaturesLayout;
