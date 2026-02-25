import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Metal() {
  /* ================= DATA ================= */
  const [metals, setMetals] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FORM ================= */
  const [metalName, setMetalName] = useState("");
  const [metalCode, setMetalCode] = useState("");
  const [editId, setEditId] = useState(null);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* ================= FETCH ================= */
  const fetchMetals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/metals");

      const mapped = res.data.data.map((m) => ({
        id: m.metal_id,
        name: m.metal_name,
        code: m.code,
        checked: false,
      }));

      setMetals(mapped);
    } catch (err) {
      console.error("Failed to fetch metals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetals();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(metals.length / itemsPerPage);

  const paginatedMetals = metals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metalName.trim() || !metalCode.trim()) return;

    try {
      if (editId) {
        // UPDATE
        await api.put(`/admin/metals/${editId}`, {
          metal_name: metalName,
          code: metalCode,
        });
      } else {
        // CREATE
        await api.post("/admin/metals", {
          metal_name: metalName,
          code: metalCode,
        });
      }

      setMetalName("");
      setMetalCode("");
      setEditId(null);
      fetchMetals();
    } catch (err) {
      if (err.response?.status === 422) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (metal) => {
    setMetalName(metal.name);
    setMetalCode(metal.code);
    setEditId(metal.id);
  };

  /* ================= CHECKBOX ================= */
  const toggleCheck = (id) => {
    setMetals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m))
    );
  };

  /* ================= DELETE (BULK) ================= */
  const handleDelete = async () => {
    const selected = metals.filter((m) => m.checked);

    if (selected.length === 0) {
      alert("Please select at least one metal");
      return;
    }

    if (!confirm("Are you sure you want to delete selected metals?")) return;

    try {
      for (const m of selected) {
        await api.delete(`/admin/metals/${m.id}`);
      }
      fetchMetals();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">📁 Metal</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded"
      >
        <div className="md:col-span-5">
          <label className="block text-sm font-medium mb-1">Metal Name :</label>
          <input
            value={metalName}
            onChange={(e) => setMetalName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter metal name"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">Metal Code :</label>
          <input
            value={metalCode}
            onChange={(e) => setMetalCode(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter metal code"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Submit"}
          </button>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => {
              setMetalName("");
              setMetalCode("");
              setEditId(null);
            }}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded"
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
              <th className="p-3 text-left">Metal Name</th>
              <th className="p-3 text-left">Metal Code</th>
              <th className="p-3 text-left">Edit</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              paginatedMetals.map((metal) => (
                <tr key={metal.id} className="border-t">
                  <td className="p-3">{metal.name}</td>
                  <td className="p-3">{metal.code}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(metal)}
                      className="text-lg"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={metal.checked}
                      onChange={() => toggleCheck(metal.id)}
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
