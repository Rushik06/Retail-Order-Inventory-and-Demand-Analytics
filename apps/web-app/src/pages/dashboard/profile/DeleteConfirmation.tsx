interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  open,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 space-y-4 animate-fadeIn">
        <h3 className="text-lg font-semibold text-slate-800">
          Delete Account
        </h3>

        <p className="text-sm text-slate-500">
          This action cannot be undone. Are you sure you want to continue?
        </p>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}