import { useEffect, useState } from "react";
import api from "../api/axios";
import CategoryForm from "./CategoryForm";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH ALL SERVICES
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/services");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (service) => {
    setEditData(service);
    setOpenForm(true);
  };

  // 🔹 SAVE (CREATE / UPDATE)
  const handleSave = async (data) => {
    try {
      if (data.id) {
        // UPDATE
        await api.put(`/admin/services/${data.id}`, {
          name: data.name,
        });
      } else {
        // CREATE
        await api.post("/admin/services", {
          name: data.name,
        });
      }

      setOpenForm(false);
      fetchServices(); // refresh list
    } catch (error) {
      if (error.response?.status === 422) {
        alert(error.response.data.message || "Validation error");
      } else {
        alert("Something went wrong");
      }
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Service not found");
      } else {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Services</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Services
        </button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Sr No</th>
              <th className="p-3 text-left">Service Name</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-4 text-center">
                  No services found
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3 flex gap-4">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openForm && (
        <CategoryForm
          data={editData}
          onClose={() => setOpenForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
