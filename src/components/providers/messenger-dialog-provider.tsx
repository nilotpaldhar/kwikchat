"use client";

import { useEffect, useState } from "react";

import NewChatDialog from "@/components/dialogs/messenger/new-chat-dialog";
import NewGroupDialog from "@/components/dialogs/messenger/new-group-dialog";
import EditMessageDialog from "@/components/dialogs/messenger/edit-message-dialog";

const MessengerDialogProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<NewChatDialog />
			<NewGroupDialog />
			<EditMessageDialog />
		</>
	);
};

export default MessengerDialogProvider;
