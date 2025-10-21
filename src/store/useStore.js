import create from "zustand";

const STORAGE_KEY = "pitchcraft_chats_v1";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
};

export const useStore = create((set, get) => ({
  chats: read(),
  activeId: null,
  theme: "light",
  createChat: (chat) =>
    set((state) => {
      const c = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        messages: chat.messages || [],
        title: chat.title || "New Pitch",
      };
      const chats = [c, ...state.chats].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      return { chats, activeId: c.id };
    }),
  saveChatResponse: (id, assistantSections) =>
    set((state) => {
      const chats = state.chats.map((c) => {
        if (c.id !== id) return c;
        const messages = c.messages ? [...c.messages] : [];
        messages.push({
          who: "assistant",
          sections: assistantSections,
          timestamp: Date.now(),
        });
        return { ...c, messages };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      return { chats };
    }),
  updateChat: (id, patch) =>
    set((state) => {
      const chats = state.chats.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      return { chats };
    }),
  deleteChat: (id) =>
    set((state) => {
      const chats = state.chats.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      const activeId =
        state.activeId === id ? chats[0]?.id || null : state.activeId;
      return { chats, activeId };
    }),
  setActive: (id) => set({ activeId: id }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
