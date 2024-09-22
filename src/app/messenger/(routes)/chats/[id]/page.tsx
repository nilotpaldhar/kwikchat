import { notFound } from "next/navigation";

import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import ChatHeader from "@/app/messenger/_components/chat-header";
import ChatSidePanel from "@/app/messenger/_components/chat-side-panel";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";
import { getConversationByIdAndUserId } from "@/data/conversation";

interface ChatPageProps {
	params: { id: string };
}

const ChatPage = async ({ params: { id } }: ChatPageProps) => {
	const session = await getSession();
	if (!session?.user.id) notFound();

	const user = await getCachedUserById(session?.user.id);
	if (!user) notFound();

	const conversation = await getConversationByIdAndUserId({ id, userId: user.id });
	if (!conversation) notFound();

	return (
		<Wrapper className="overflow-hidden">
			<WrapperSidePanel className="bg-surface-light-100 dark:bg-surface-dark-600">
				<ChatSidePanel />
			</WrapperSidePanel>
			<WrapperContentZone className="bg-surface-light-200 dark:bg-surface-dark-500">
				<WrapperHeader className="border-b border-neutral-200 px-4 dark:border-neutral-900 sm:px-8 md:px-5">
					<ChatHeader
						conversationId={conversation.id}
						conversationType={conversation.isGroup ? "group" : "private"}
					/>
				</WrapperHeader>
				<WrapperContent className="bg-transparent p-5 dark:bg-transparent">
					Chat content will go here...
				</WrapperContent>
				<WrapperFooter className="px-4 sm:px-8 md:px-5">
					<div className="flex h-full items-center">Chat input will go here...</div>
				</WrapperFooter>
			</WrapperContentZone>
		</Wrapper>
	);
};

export default ChatPage;
