import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Color() {
  /* ================= DATA ================= */
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FORM ================= */
  const [colorInput, setColorInput] = useState("");
  const [editId, setEditId] = useState(null);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* ================= FETCH COLORS ================= */
  const fetchColors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/colors");

      const mapped = res.data.data.map((c) => ({
        id: c.color_id,
        name: c.color_code,
        checked: false,
      }));

      setColors(mapped);
    } catch (err) {
      console.error("Failed to fetch colors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(colors.length / itemsPerPage);

  const paginatedColors = colors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!colorInput.trim()) return;

    try {
      if (editId) {
        // UPDATE
        await api.put(`/admin/colors/${editId}`, {
          color_code: colorInput,
        });
      } else {
        // CREATE
        await api.post("/admin/colors", {
          color_code: colorInput,
        });
      }

      setColorInput("");
      setEditId(null);
      fetchColors();
    } catch (err) {
      if (err.response?.status === 422) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (color) => {
    setColorInput(color.name);
    setEditId(color.id);
  };

  /* ================= CHECKBOX ================= */
  const toggleCheck = (id) => {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  /* ================= DELETE (BULK) ================= */
  const handleDelete = async () => {
    const selected = colors.filter((c) => c.checked);

    if (selected.length === 0) {
      alert("Please select at least one color");
      return;
    }

    if (!confirm("Are you sure you want to delete selected colors?")) return;

    try {
      for (const c of selected) {
        await api.delete(`/admin/colors/${c.id}`);
      }
      fetchColors();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">📁 Color</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Color :</label>
          <input
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter color"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => {
              setColorInput("");
              setEditId(null);
            }}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3 text-left">Color Code</th>
              <th className="p-3 text-left">Edit</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              paginatedColors.map((color) => (
                <tr key={color.id} className="border-t">
                  <td className="p-3">{color.name}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(color)}
                      className="text-lg"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={color.checked}
                      onChange={() => toggleCheck(color.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE */}
      <button
        onClick={handleDelete}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Delete
      </button>

      {/* PAGINATION */}
      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded border">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
