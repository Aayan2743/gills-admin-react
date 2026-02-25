import { useEffect, useState } from "react";

export default function CategoryForm({ data, onClose, onSave }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (data) setName(data.name);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: data?.id, name });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {data ? "Edit Service" : "Add Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Service name"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
