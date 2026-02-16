import { create } from 'zustand';

interface IStoreState {
  count: number;
  isLoading: boolean;
}
interface IStoreAction {
  increment: (step: number) => void;
  reset: () => void;
}

type IGlobalStore = IStoreState & IStoreAction;

export const useGlobalStore = create<IGlobalStore>((set) => ({
  count: 0,
  isLoading: false,
  increment: (step: number) => set((state) => ({ count: state.count + step })),
  reset: () => set({ count: 0, isLoading: false })
}));
