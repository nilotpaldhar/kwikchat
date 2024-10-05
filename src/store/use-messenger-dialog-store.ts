import { create } from "zustand";

export type ModalType = "NEW_CHAT" | "NEW_GROUP_CHAT" | "EDIT_MESSAGE";

interface DialogData {
	messageToEdit?: {
		messageid: string;
		conversationId: string;
		content: string;
		timestamp: string;
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
	onClose: () => set({ isOpen: false, data: { messageToEdit: undefined } }),
}));

export default useMessengerDialogStore;
