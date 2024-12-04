import type { GroupMember } from "@/types";
import { create } from "zustand";

interface GroupMembershipStore {
	membership?: GroupMember;
	setMembership: (membership?: GroupMember) => void;
}

const useGroupMembershipStore = create<GroupMembershipStore>((set) => ({
	membership: undefined,
	setMembership: (membership) => set({ membership }),
}));

export default useGroupMembershipStore;
