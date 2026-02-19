/*eslint-disable*/ 
import { useState } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/app/app.state";

import ProfileActions from "./ProfileActions";
import ProfileEditButtons from "./ProfileEditButtons";
import StatusMessage from "./StatusMessage";
import DeleteConfirmation from "./DeleteConfirmation";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ----------------------------
  // UPDATE PROFILE
  // ----------------------------
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.patch("/profile", form);

      setUser(res.data);
      setEditMode(false);

      setMessage("Profile updated successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // DELETE PROFILE
  // ----------------------------
  const handleDelete = async () => {
    try {
      await api.delete("/profile");

      localStorage.clear();
      window.location.href = "/login";
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Profile Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative">

        {/* Top Right Icons */}
        {!editMode && (
          <ProfileActions
            onEdit={() => setEditMode(true)}
            onDelete={() => setConfirmDelete(true)}
          />
        )}

        {/* Avatar + Basic Info */}
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-600">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {user?.name}
            </h2>
            <p className="text-slate-500 text-sm">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-200" />

        {/* Editable Form */}
        <div className="space-y-6 max-w-md">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Full Name
            </label>

            <input
              disabled={!editMode}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg border transition ${
                editMode
                  ? "border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  : "bg-slate-100 border-slate-200"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email Address
            </label>

            <input
              disabled={!editMode}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg border transition ${
                editMode
                  ? "border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  : "bg-slate-100 border-slate-200"
              }`}
            />
          </div>

          {/* Save / Cancel */}
          {editMode && (
            <ProfileEditButtons
              loading={loading}
              onSave={handleUpdate}
              onCancel={() => {
                setEditMode(false);
                setForm({
                  name: user?.name || "",
                  email: user?.email || "",
                });
              }}
            />
          )}

          {/* Status Message */}
          <StatusMessage message={message} />

        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmation
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />

    </div>
  );
}