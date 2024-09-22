import { create } from "zustand";

export type InfoType = "USER_INFO" | "GROUP_INFO";

interface ChatInfoStore {
	type: InfoType | null;
	isOpen: boolean;
	onOpen: (type: InfoType) => void;
	toggleOpen: (type: InfoType) => void;
	onClose: () => void;
}

const useChatInfoStore = create<ChatInfoStore>((set) => ({
	type: null,
	isOpen: false,
	onOpen: (type) => set({ isOpen: true, type }),
	toggleOpen: (type) => set((state) => ({ isOpen: !state.isOpen, type })),
	onClose: () => set({ isOpen: false }),
}));

export default useChatInfoStore;
