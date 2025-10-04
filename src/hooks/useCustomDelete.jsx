import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useToast } from "./useToast";

export const useConfirmDelete = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const confirmAndDelete = async ({
    id,
    action,
    entity = "item",
    onSuccess,
    onError,
  }) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this ${entity}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const toastId = toast.showLoading(`Deleting ${entity}...`);

      try {
  const result = await dispatch(action(id)).unwrap(); // ✅ Will throw if rejected
  toast.showSuccess(`${entity} deleted successfully`, { id: toastId });
  onSuccess && onSuccess(result);
} catch (err) {
  toast.showError(err.message || `Failed to delete ${entity}`, { id: toastId });
  onError && onError(err);
}

    }
  };

  return { confirmAndDelete };
};
