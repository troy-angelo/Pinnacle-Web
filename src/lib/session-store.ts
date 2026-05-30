import { create } from 'zustand';
import type { Provider } from './types';
import { providers } from './mock-data';

interface SessionState {
  provider: Provider;
  connectNow: boolean;
  setActiveProvider: (id: string) => void;
  toggleConnectNow: () => void;
}

export const useSession = create<SessionState>((set) => ({
  provider: providers[0],
  connectNow: providers[0].connectNowActive,
  setActiveProvider: (id: string) => {
    const provider = providers.find((p) => p.id === id);
    if (provider) {
      set({ provider, connectNow: provider.connectNowActive });
    }
  },
  toggleConnectNow: () => set((state) => ({ connectNow: !state.connectNow })),
}));

export const setActiveProvider = (id: string) => {
  useSession.getState().setActiveProvider(id);
};

export const toggleConnectNow = () => {
  useSession.getState().toggleConnectNow();
};
