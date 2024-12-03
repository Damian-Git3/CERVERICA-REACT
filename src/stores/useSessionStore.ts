import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SessionDTO } from "../dtos/SessionDTO";

interface SessionState {
  session: SessionDTO | null;
  setSession: (session: SessionDTO | null) => void;
  cerrarSesion: () => void;
}

const localStorageAdapter = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      cerrarSesion: () => set({ session: null }),
    }),
    {
      name: "session-storage",
      storage: localStorageAdapter,
    }
  )
);

export default useSessionStore;
