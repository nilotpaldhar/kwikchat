import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { messageKeys } from "@/constants/tanstack-query";
import { fetchPrivateMessages, sendPrivateMessage } from "@/services/message";

const usePrivateMessagesQuery = ({ conversationId }: { conversationId: string }) => {
	const query = useQuery({
		queryKey: messageKeys.all(conversationId),
		queryFn: () => fetchPrivateMessages({ conversationId }),
	});

	return query;
};

const useSendPrivateMessage = () =>
	useMutation({
		mutationFn: sendPrivateMessage,
		onSuccess: () => {
			toast.success("Message sent!!!", { position: "top-right" });
		},
	});

export { usePrivateMessagesQuery, useSendPrivateMessage };
