"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Loader from "@/components/ui/loader";
import { WrapperContentZone, WrapperContent } from "@/app/messenger/_components/wrapper";

import findOrCreateConversationPath from "@/actions/conversation/find-or-create-conversation-path";

interface OpenChatPageProps {
	searchParams: Promise<{
		friend_id?: string;
		fallback_path?: string;
	}>;
}

const OpenChatPage = (props: OpenChatPageProps) => {
	const router = useRouter();

	const searchParams = use(props.searchParams);
	const friendId = searchParams.friend_id;
	const fallbackPath = searchParams.fallback_path;

	useEffect(() => {
		const initConversation = async () => {
			const { redirectPath, error } = await findOrCreateConversationPath({
				friendId,
				fallbackPath,
			});
			if (error) toast.error("Chat initialization failed. Please try again!");
			router.replace(redirectPath);
		};

		initConversation();
	}, [friendId, fallbackPath, router]);

	return (
		<WrapperContentZone>
			<WrapperContent className="m-0 h-screen">
				<div className="flex h-full items-center justify-center">
					<Loader />
				</div>
			</WrapperContent>
		</WrapperContentZone>
	);
};

export default OpenChatPage;
