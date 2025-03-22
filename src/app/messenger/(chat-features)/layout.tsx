import type { Metadata } from "next";

import ImagekitProvider from "@/components/providers/imagekit-provider";
import { Wrapper, WrapperSidePanel } from "@/app/messenger/_components/wrapper";
import ChatSidePanel from "@/app/messenger/(chat-features)/_components/chat-side-panel";

import { APP_NAME } from "@/constants/seo";

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_NAME}`,
		default: "Welcome to Messenger",
	},
	description:
		"Explore the messaging hub designed for efficient one-on-one and group communication.",
};

interface ChatFeaturesLayoutProps {
	children: React.ReactNode;
}

const ChatFeaturesLayout = ({ children }: ChatFeaturesLayoutProps) => (
	<ImagekitProvider>
		<Wrapper className="overflow-hidden">
			<WrapperSidePanel className="bg-surface-light-100 dark:bg-surface-dark-600">
				<ChatSidePanel />
			</WrapperSidePanel>
			{children}
		</Wrapper>
	</ImagekitProvider>
);

export default ChatFeaturesLayout;
