import { Save, X } from "lucide-react";

interface Props {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileEditButtons({
  loading,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="flex gap-4 pt-2">
      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-slate-600 px-5 py-2 rounded-lg hover:bg-slate-100 transition"
      >
        <X size={16} />
        Cancel
      </button>
    </div>
  );
}