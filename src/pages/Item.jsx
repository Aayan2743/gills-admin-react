import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Item() {
  /* ================= DATA ================= */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FORM ================= */
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [editId, setEditId] = useState(null);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* ================= FETCH ================= */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/items");

      const mapped = res.data.data.map((i) => ({
        id: i.item_id,
        name: i.item_name,
        code: i.item_code,
        active: i.active,
        checked: false,
      }));

      setItems(mapped);
    } catch (err) {
      console.error("Failed to fetch items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemCode.trim()) return;

    try {
      if (editId) {
        // UPDATE
        await api.put(`/admin/items/${editId}`, {
          item_name: itemName,
          item_code: itemCode,
        });
      } else {
        // CREATE
        await api.post("/admin/items", {
          item_name: itemName,
          item_code: itemCode,
        });
      }

      setItemName("");
      setItemCode("");
      setEditId(null);
      fetchItems();
    } catch (err) {
      if (err.response?.status === 422) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setItemName(item.name);
    setItemCode(item.code);
    setEditId(item.id);
  };

  /* ================= CHECKBOX ================= */
  const toggleCheck = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  /* ================= DELETE (BULK) ================= */
  const handleDelete = async () => {
    const selected = items.filter((i) => i.checked);

    if (selected.length === 0) {
      alert("Please select at least one item");
      return;
    }

    if (!confirm("Are you sure you want to delete selected items?")) return;

    try {
      for (const i of selected) {
        await api.delete(`/admin/items/${i.id}`);
      }
      fetchItems();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-xl font-semibold flex items-center gap-2">📁 Item</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded"
      >
        <div className="md:col-span-4">
          <label className="block text-sm font-medium mb-1">Item name :</label>
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">Item Code :</label>
          <input
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            className="w-full border rounded px-3 py-2"
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
              setItemName("");
              setItemCode("");
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
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-left">Item Code</th>
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
              paginatedItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.code}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-lg"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
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
