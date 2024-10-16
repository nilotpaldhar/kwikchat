import type { CompleteMessage } from "@/types";

import { create } from "zustand";

export type ModalType =
	| "NEW_CHAT"
	| "NEW_GROUP_CHAT"
	| "EDIT_MESSAGE"
	| "DELETE_MESSAGE"
	| "CLEAR_CONVERSATION";

interface DialogData {
	messageToEdit?: {
		messageId: string;
		conversationId: string;
		content: string;
		timestamp: string;
	};
	messageToDelete?: {
		message: CompleteMessage;
		showDeleteForEveryone: boolean;
	};
	conversationToClear?: {
		conversationId: string;
	};
}

interface MessengerDialogStore {
	type: ModalType | null;
	isOpen: boolean;
	data: DialogData;
	onOpen: (type: ModalType, data?: DialogData) => void;
	setOpen: (isOpen: boolean) => void;
	onClose: () => void;
}

const useMessengerDialogStore = create<MessengerDialogStore>((set) => ({
	type: null,
	isOpen: false,
	data: {},
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	setOpen: (isOpen) => set({ isOpen }),
	onClose: () =>
		set({
			isOpen: false,
			data: {
				messageToEdit: undefined,
				messageToDelete: undefined,
				conversationToClear: undefined,
			},
		}),
}));

export default useMessengerDialogStore;
