import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ConfirmationList() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchId, setSearchId] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  /* ================= FETCH LIST ================= */
  const fetchConfirmations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/job-confirmation", {
        params: {
          page,
          confirmation_id: searchId,
          client: searchClient,
        },
      });

      const paged = res.data.data;
      setRows(paged.data);
      setTotalPages(paged.last_page);
    } catch {
      alert("Failed to load confirmations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmations();
  }, [page, searchId, searchClient]);

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Confirmation List</h1>

        <Link
          to="/job-confirmation"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          + New Confirmation
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search Confirmation No"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setPage(1);
          }}
          className="input"
        />

        <input
          placeholder="Search Client Name"
          value={searchClient}
          onChange={(e) => {
            setSearchClient(e.target.value);
            setPage(1);
          }}
          className="input"
        />

        <div className="md:col-span-2 flex gap-3">
          <button
            onClick={fetchConfirmations}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Search
          </button>

          <button
            onClick={() => {
              setSearchId("");
              setSearchClient("");
              setPage(1);
            }}
            className="border px-6 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">S.No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Confirmation ID</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Depositor</th>
              <th className="px-4 py-3 text-left">Receiver</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row, index) => (
                <tr key={row.conf_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3">{row.recievedate}</td>
                  <td className="px-4 py-3 font-medium">
                    {row.confirmationid}
                  </td>
                  <td className="px-4 py-3">{row.client?.client_name}</td>
                  <td className="px-4 py-3">{row.depositer_name}</td>
                  <td className="px-4 py-3">{row.reciever}</td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <Link
                      to={`/edit-confirmation/${row.conf_id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/confirmation-print/${row.conf_id}`}
                      className="text-green-600 hover:underline"
                    >
                      Print
                    </Link>
                  </td>
                </tr>
              ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {rows.map((row) => (
          <div
            key={row.conf_id}
            className="bg-white p-4 rounded-xl shadow space-y-1"
          >
            <p className="font-semibold">{row.confirmationid}</p>
            <p className="text-sm text-gray-600">{row.client?.client_name}</p>
            <p className="text-sm text-gray-600">{row.recievedate}</p>

            <div className="flex gap-4 pt-2">
              <Link
                to={`/edit-confirmation/${row.conf_id}`}
                className="text-indigo-600 text-sm"
              >
                Edit
              </Link>
              <Link
                to={`/confirmation-print/${row.conf_id}`}
                className="text-green-600 text-sm"
              >
                Print
              </Link>
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
