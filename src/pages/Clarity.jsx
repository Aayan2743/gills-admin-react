import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Clarity() {
  /* ================= DATA ================= */
  const [clarities, setClarities] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FORM ================= */
  const [clarityInput, setClarityInput] = useState("");
  const [editId, setEditId] = useState(null);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* ================= FETCH ================= */
  const fetchClarities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/clarities");

      const mapped = res.data.data.map((c) => ({
        id: c.id,
        name: c.Clarity, // normalize here
        checked: false,
      }));

      setClarities(mapped);
    } catch (err) {
      console.error("Failed to fetch clarities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClarities();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(clarities.length / itemsPerPage);

  const paginatedClarities = clarities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("dfdfdfd", editId);
    // return;

    if (!clarityInput.trim()) return;

    try {
      if (editId) {
        // UPDATE
        await api.put(`/admin/clarities/${editId}`, {
          clarity: clarityInput,
        });
      } else {
        // CREATE
        await api.post("/admin/clarities", {
          clarity: clarityInput,
        });
      }

      setClarityInput("");
      setEditId(null);
      fetchClarities();
    } catch (err) {
      if (err.response?.status === 422) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (clarity) => {
    setClarityInput(clarity.name);
    setEditId(clarity.id);
  };

  /* ================= CHECKBOX ================= */
  const toggleCheck = (id) => {
    setClarities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  /* ================= DELETE (BULK) ================= */
  const handleDelete = async () => {
    const selected = clarities.filter((c) => c.checked);

    if (selected.length === 0) {
      alert("Please select at least one clarity");
      return;
    }

    if (!confirm("Are you sure you want to delete selected clarities?")) return;

    try {
      for (const c of selected) {
        await api.delete(`/admin/clarities/${c.id}`);
      }
      fetchClarities();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-xl font-semibold flex items-center gap-2">
        📁 Clarity
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Clarity :</label>
          <input
            value={clarityInput}
            onChange={(e) => setClarityInput(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter clarity"
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
              setClarityInput("");
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
              <th className="p-3 text-left">Clarity Name</th>
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
              paginatedClarities.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(c)} className="text-lg">
                      ✏️
                    </button>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={c.checked}
                      onChange={() => toggleCheck(c.id)}
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
