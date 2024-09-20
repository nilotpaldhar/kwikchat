import { create } from "zustand";

export type ModalType = "NEW_CHAT" | "NEW_GROUP_CHAT";

interface MessengerDialogStore {
	type: ModalType | null;
	isOpen: boolean;
	onOpen: (type: ModalType) => void;
	setOpen: (isOpen: boolean) => void;
	onClose: () => void;
}

const useMessengerDialogStore = create<MessengerDialogStore>((set) => ({
	type: null,
	isOpen: false,
	onOpen: (type) => set({ isOpen: true, type }),
	setOpen: (isOpen) => set({ isOpen }),
	onClose: () => set({ isOpen: false }),
}));

export default useMessengerDialogStore;
