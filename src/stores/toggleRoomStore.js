import { create } from "zustand";

export const useToggleRoomStore = create((set) => ({
  isDarkRoom: false, // Always light mode
  isTransitioning: false,
  isBeforeZooming: false,

  setDarkRoom: (booleanValue) =>
    set({
      isDarkRoom: false, // Force light mode
    }),

  setIsTransitioning: (booleanValue) =>
    set({
      isTransitioning: booleanValue,
    }),

  setIsBeforeZooming: (booleanValue) =>
    set({
      isBeforeZooming: booleanValue,
    }),
}));
