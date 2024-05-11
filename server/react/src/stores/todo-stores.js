import { create } from "zustand";

const useStore = create((set) => ({
  errorMsg: "",
  setErrorMsg: (errorMsg) => set({ errorMsg }),
}));

export const useTodoStore = () => {
  const errorMsg = useStore((state) => state.errorMsg);
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  return { errorMsg, setErrorMsg };
};
