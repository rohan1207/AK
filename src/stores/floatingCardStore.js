import { create } from "zustand";

export const useFloatingCardStore = create((set) => ({
  isVisible: false,
  position: [0, 0],
  text: "",

  setFloatingCard: (visible, position, text) =>
    set({
      isVisible: visible,
      position: position,
      text: text,
    }),
}));
