import toast from "react-hot-toast";

// Show toast for promise (loading, success, error)
export const showToastPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Loading...",
      success: (res) => res?.message || messages.success || "Success!",
      error: (err) => err?.message || messages.error || "Something went wrong",
    },
    {
      duration: 3000, // Toast duration: 3 seconds
    }
  );
};

// Simple success toast
export const showSuccessToast = (message) => {
  toast.success(message || "Success", { duration: 3000 });
};

// Simple error toast
export const showErrorToast = (message) => {
  toast.error(message || "Something went wrong", { duration: 3000 });
};
