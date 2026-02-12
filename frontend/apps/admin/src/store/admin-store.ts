import { create } from "zustand";
import type { AdminMe } from "@repo/api-client";

interface AdminState {
	me: AdminMe | null;
	setMe: (me: AdminMe | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
	me: null,
	setMe: (me) => set({ me }),
}));
