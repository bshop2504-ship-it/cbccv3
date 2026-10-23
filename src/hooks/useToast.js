import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

// const toast = useToast();
// toast.success("Saved");  toast.error(err);  toast.info("Heads up");
// error() accepts a string, an Error, or a { message } object.
export function useToast() {
  const toast = useContext(ToastContext);

  if (!toast) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return toast;
}
