import { Pencil, Trash2 } from "lucide-react";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProfileActions({ onEdit, onDelete }: Props) {
  return (
    <div className="absolute top-6 right-6 flex gap-3">
      <button
        onClick={onEdit}
        className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-blue-50 text-blue-600 transition"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={onDelete}
        className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-red-50 text-red-600 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}