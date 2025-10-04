import { toast } from 'react-hot-toast';

export const useToast = () => {
  const showLoading = (message = 'Loading...') => toast.loading(message);
  const showSuccess = (message = 'Success!', options = {}) => toast.success(message, options);
  const showError = (message = 'Something went wrong!', options = {}) => toast.error(message, options);
  const dismiss = (toastId) => toast.dismiss(toastId);

  return {
    showLoading,
    showSuccess,
    showError,
    dismiss,
  };
};
