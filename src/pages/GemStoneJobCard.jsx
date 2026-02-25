import { useState,useEffect
 } from "react";

import api  from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function GemStoneJobCard() {
  const [activeTab, setActiveTab] = useState("entry");

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <h1 className="text-xl font-semibold flex items-center gap-2">
        📁 Jewellery Job Card
      </h1>

      {/* ================= TABS ================= */}
      <div className="flex gap-2 border-b">
        <TabButton
          active={activeTab === "entry"}
          onClick={() => setActiveTab("entry")}
        >
          Job Card Entry
        </TabButton>

        <TabButton
          active={activeTab === "list"}
          onClick={() => setActiveTab("list")}
        >
          Job Card List
        </TabButton>

        <TabButton
          active={activeTab === "image"}
          onClick={() => setActiveTab("image")}
        >
          Image Upload
        </TabButton>
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === "entry" && <JobCardEntry />}
      {activeTab === "list" && <JobCardList />}
      {activeTab === "image" && <JobCardImageUpload />}
    </div>
  );
}

/* =====================================================
   TAB BUTTON
===================================================== */
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 ${
        active
          ? "border-indigo-600 text-indigo-600"
          : "border-transparent text-gray-600 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}



function JobCardEntry() {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="font-semibold text-lg">
        📄 Gem Stone Job Card Entry Form
      </h2>

      <div className="flex items-center gap-4">
        <input type="file" className="border rounded px-3 py-2" />
        <button className="bg-gray-800 text-white px-6 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
}



function JobCardList() {
   const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [confirmationNo, setConfirmationNo] = useState("");
  const [jobcardId, setJobcardId] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [selected, setSelected] = useState([]);
  const [imageCert, setImageCert] = useState(false);
  const [bigJewellery, setBigJewellery] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchJobCards = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/gemstone-jobcards", {
        params: {
          confirmation_no: confirmationNo,
          jobcard_id: jobcardId,
          page: pageNo,
        },
      });

      setData(res.data.data);
      setPage(res.data.pagination.current_page);
      setLastPage(res.data.pagination.last_page);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

  /* ================= CHECKBOX ================= */
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ================= DELETE ================= */
  const deleteSelected = async () => {
    if (!selected.length) return alert("No records selected");

    if (!window.confirm("Delete selected job cards?")) return;

    await axios.delete("/api/jobcards/bulk-delete", {
      data: { ids: selected },
    });

    setSelected([]);
    fetchJobCards(page);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    fetchJobCards(1);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">
        📋 Jewellery Job Card List
      </h2>

      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded">
        <input
          value={confirmationNo}
          onChange={(e) => setConfirmationNo(e.target.value)}
          placeholder="Confirmation No"
          className="border px-3 py-2 rounded"
        />

        <input
          value={jobcardId}
          onChange={(e) => setJobcardId(e.target.value)}
          placeholder="Jobcard ID"
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        <button
          onClick={() => {
            setConfirmationNo("");
            setJobcardId("");
            fetchJobCards(1);
          }}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Reset
        </button>

        <button
          onClick={() =>
            window.open("/api/jobcards/export-excel", "_blank")
          }
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>
      </div>

      {/* OPTIONS */}
      <div className="flex items-center gap-6">
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={imageCert}
            onChange={() => setImageCert(!imageCert)}
          />
          Image Certificate
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={bigJewellery}
            onChange={() => setBigJewellery(!bigJewellery)}
          />
          Big Jewellery Certificate
        </label>

        <button className="bg-indigo-600 text-white px-6 py-2 rounded">
          Submit
        </button>

        <button
          onClick={deleteSelected}
          className="bg-red-600 text-white px-6 py-2 rounded"
        >
          Delete Selected
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Confirmation No</th>
              <th className="p-3">Jobcard ID</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
              <th className="p-3">Select</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.gjobcard_id} className="border-t">
                  <td className="p-3">
                    {(page - 1) * 10 + i + 1}
                  </td>
                  <td className="p-3">{row.confirmid}</td>
                  <td className="p-3">{row.gjobcardid}</td>
                  <td className="p-3 text-blue-600 cursor-pointer"
                  
                  onClick={() => navigate(`/edit-gem-stone-job-card/${row.gjobcard_id}`)}
                  
                  >
                    Edit
                  </td>
                  <td className="p-3 text-red-600 cursor-pointer">
                    Delete
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(row.gjobcard_id)}
                      onChange={() =>
                        toggleSelect(row.gjobcard_id)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button
          disabled={page === 1}
          onClick={() => fetchJobCards(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => fetchJobCards(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}




function JobCardImageUpload() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">
        🖼 Gem Stone Job Card Image Upload
      </h2>

      {/* SEARCH */}
      <div className="flex gap-4 bg-gray-50 p-4 rounded">
        <input
          placeholder="Old Confirmation Number"
          className="border px-3 py-2 rounded"
        />
        <button className="bg-gray-800 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3">SNo</th>
              <th className="p-3">Confirmation No</th>
              <th className="p-3">Jobcard Id</th>
              <th className="p-3">Edit</th>
              <th className="p-3">File Upload</th>
              <th className="p-3">Filename</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{i}</td>
                <td className="p-3">GILCNF77{i}</td>
                <td className="p-3">GILHJ309{i}K</td>
                <td className="p-3 text-blue-600 cursor-pointer">
                  edit
                </td>
                <td className="p-3">
                  <input type="file" />
                </td>
                <td className="p-3 text-gray-500">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
