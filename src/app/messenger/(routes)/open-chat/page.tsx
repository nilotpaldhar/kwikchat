"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import findOrCreateConversationPath from "@/actions/conversation/find-or-create-conversation-path";

import Loader from "@/components/ui/loader";

interface OpenChatPageProps {
	searchParams: {
		friend_id?: string;
		fallback_path?: string;
	};
}

const OpenChatPage = ({ searchParams }: OpenChatPageProps) => {
	const router = useRouter();

	const friendId = searchParams.friend_id;
	const fallbackPath = searchParams.fallback_path;

	useEffect(() => {
		const initConversation = async () => {
			const { redirectPath, error } = await findOrCreateConversationPath({
				friendId,
				fallbackPath,
			});
			if (error) toast.error("Failed to initialize chat!");
			router.replace(redirectPath);
		};

		initConversation();
	}, [friendId, fallbackPath, router]);

	return (
		<div className="flex h-full items-center justify-center">
			<Loader loading />
		</div>
	);
};

export default OpenChatPage;
