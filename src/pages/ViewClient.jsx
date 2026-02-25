import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ViewClient() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  const [search, setSearch] = useState("");

  /* ================= FETCH CLIENTS ================= */
  const fetchClients = async (pageNo = 1) => {
    try {
      setLoading(true);

      const res = await api.get("/admin/clients", {
        params: {
          page: pageNo,
          per_page: perPage,
          search: search,
        },
      });

      const paginated = res.data.data;

      setClients(
        paginated.data.map((c) => ({
          id: c.client_id,
          name: c.client_name,
          mobile: c.phonenumber,
          city: c.city,
          gstin: c.gstno ?? "--",
          status: "Active", // backend not sending yet
        }))
      );

      setPage(paginated.current_page);
      setTotalPages(paginated.last_page);
    } catch (err) {
      alert("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchClients(page);
  }, [page, search]);

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">View Clients</h1>

        <input
          placeholder="Search client..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Client", "Mobile", "City", "GSTIN", "Status", "Action"].map(
                (h) => (
                  <th key={h} className="px-6 py-3 text-left text-gray-600">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && clients.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            )}

            {!loading &&
              clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4">{c.mobile}</td>
                  <td className="px-6 py-4">{c.city}</td>
                  <td className="px-6 py-4">{c.gstin}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => navigate(`/client/${c.id}`)}
                      className="text-indigo-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-client/${c.id}`)}
                      className="text-gray-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {clients.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between">
              <h3 className="font-semibold">{c.name}</h3>
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                {c.status}
              </span>
            </div>
            <p className="text-sm">📞 {c.mobile}</p>
            <p className="text-sm">📍 {c.city}</p>
            <p className="text-sm break-all">🧾 {c.gstin}</p>

            <div className="mt-2 flex gap-3">
              <button
                onClick={() => navigate(`/client/${c.id}`)}
                className="text-indigo-600 text-sm"
              >
                View
              </button>
              <button
                onClick={() => navigate(`/edit-client/${c.id}`)}
                className="text-gray-600 text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
