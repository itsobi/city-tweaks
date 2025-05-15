import { create } from 'zustand';

interface CityTweakStore {
  isCreateCityTweakOpen: boolean;
  setIsCreateCityTweakOpen: (open: boolean) => void;
}

export const useCityTweakStore = create<CityTweakStore>((set) => ({
  isCreateCityTweakOpen: false,
  setIsCreateCityTweakOpen: (open) => set({ isCreateCityTweakOpen: open }),
}));
