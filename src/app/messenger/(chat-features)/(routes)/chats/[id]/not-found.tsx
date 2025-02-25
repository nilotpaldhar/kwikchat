import { MessageCircleOff } from "lucide-react";

import { WrapperContentZone } from "@/app/messenger/_components/wrapper";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

const ChatNotFound = () => (
	<WrapperContentZone>
		<div className="h-screen overflow-y-auto scrollbar-none">
			<div className="mb-20 mt-16 bg-transparent p-5 dark:bg-transparent">
				<div className="pt-20 lg:pt-32 xl:pt-40">
					<Empty>
						<EmptyIcon icon={MessageCircleOff} size={64} />
						<EmptyTitle>Chat Not Found - This Conversation is Missing!</EmptyTitle>
						<EmptyDescription className="max-w-md">
							Looks like this chat has disappeared or doesn&apos;t exist. It might have been
							deleted, or you may have followed an outdated link. Try refreshing or starting a new
							conversation!
						</EmptyDescription>
					</Empty>
				</div>
			</div>
		</div>
	</WrapperContentZone>
);

export default ChatNotFound;
