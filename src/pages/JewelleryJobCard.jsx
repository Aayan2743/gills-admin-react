import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import { ImageIcon, Pencil } from "lucide-react";

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function JewelleryJobCard() {
  const [activeTab, setActiveTab] = useState("entry");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        📁 Jewellery Job Card - (Diamond Jewellery Certification, Soltaire
        Diamond Jewellery Certification)
      </h1>

      {/* TABS */}
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

        <a
          href="/excels/one.csv" // file inside public folder
          download
          className="ml-auto px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Excel
        </a>
      </div>

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

/* =====================================================
   JOB CARD ENTRY (CSV UPLOAD)
===================================================== */
function JobCardEntry() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submitCSV = async () => {
    if (!file) return alert("Please select CSV file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await api.post("/admin/jobcards/import", formData);
      setMsg(res.data.message || "Uploaded successfully");
    } catch {
      setMsg("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="font-semibold text-lg">📄 Job Card Entry</h2>

      <div className="flex gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={submitCSV}
          disabled={loading}
          className="bg-gray-800 text-white px-6 py-2 rounded"
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </div>

      {msg && <p className="text-green-600 text-sm">{msg}</p>}
    </div>
  );
}

/* =====================================================
   JOB CARD LIST (WITH PAGINATION)
===================================================== */
function JobCardList_old() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [confirmid, setConfirmid] = useState("");
  const [jobcardid, setJobcardid] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = async (p = 1) => {
    const res = await api.get("/admin/jobcards", {
      params: { confirmid, jobcardid, page: p },
    });
    setRows(res.data.data);
    setPage(res.data.current_page);
    setLastPage(res.data.last_page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">📋 Job Card List</h2>

      {/* FILTER */}
      <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
        <input
          placeholder="Confirmation No"
          value={confirmid}
          onChange={(e) => setConfirmid(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Jobcard ID"
          value={jobcardid}
          onChange={(e) => setJobcardid(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={() => fetchData(1)}
          className="bg-gray-800 text-white rounded px-4"
        >
          Search
        </button>
        <button
          onClick={() => {
            setConfirmid("");
            setJobcardid("");
            fetchData(1);
          }}
          className="bg-gray-300 rounded px-4"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Confirmation</th>
              <th className="p-3">Jobcard</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{(page - 1) * 10 + i + 1}</td>
                <td className="p-3">{r.confirmid}</td>
                <td className="p-3">{r.jobcardid}</td>
                <td
                  className="p-3 text-blue-600 cursor-pointer"
                  onClick={() => navigate(`/edit-job-card/${r.id}`)}
                >
                  Edit
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button disabled={page === 1} onClick={() => fetchData(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {lastPage}
        </span>
        <button
          disabled={page === lastPage}
          onClick={() => fetchData(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function JobCardList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [confirmid, setConfirmid] = useState("");
  const [jobcardid, setJobcardid] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ✅ Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ✅ Action checkboxes
  const [imageCert, setImageCert] = useState(false);
  const [bigJewelleryCert, setBigJewelleryCert] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async (p = 1) => {
    const res = await api.get("/admin/jobcards", {
      params: { confirmid, jobcardid, page: p },
    });

    setRows(res.data.data);
    setPage(res.data.current_page);
    setLastPage(res.data.last_page);
    setSelectedIds([]);
    setSelectAll(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- CHECKBOX HANDLERS ---------------- */
  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((r) => r.id));
    }
    setSelectAll(!selectAll);
  };

  /* ---------------- DELETE ---------------- */
  const deleteRow = async (id) => {
    if (!window.confirm("Delete this job card?")) return;
    await api.delete(`/admin/jobcards/${id}`);
    fetchData(page);
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return alert("Select at least one row");
    if (!window.confirm("Delete selected job cards?")) return;

    await api.post("/admin/jobcards/bulk-delete", {
      ids: selectedIds,
    });

    fetchData(page);
  };

  /* ---------------- SUBMIT CERTIFICATE ---------------- */
  const submitCertificate = () => {
    if (!selectedIds.length) {
      return alert("Select at least one job card");
    }
    alert(bigJewelleryCert);
    if (!imageCert && !bigJewelleryCert) {
      return alert("Select at least one certificate type");
    }

    // 🔥 Navigate or open certificate page
    navigate("/certificates/preview", {
      state: {
        jobcard_ids: selectedIds,
        image_certificate: imageCert,
        big_jewellery: bigJewelleryCert,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">📋 Jewellery Job Card List</h2>

      {/* FILTER */}
      <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
        <input
          placeholder="Confirmation No"
          value={confirmid}
          onChange={(e) => setConfirmid(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Jobcard ID"
          value={jobcardid}
          onChange={(e) => setJobcardid(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={() => fetchData(1)}
          className="bg-gray-800 text-white rounded px-4"
        >
          Search
        </button>

        <button
          onClick={() => {
            setConfirmid("");
            setJobcardid("");
            fetchData(1);
          }}
          className="bg-gray-300 rounded px-4"
        >
          Reset
        </button>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap items-center gap-6 bg-gray-100 p-4 rounded">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={imageCert}
            onChange={() => setImageCert(!imageCert)}
          />
          Image Certificate
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bigJewelleryCert}
            onChange={() => setBigJewelleryCert(!bigJewelleryCert)}
          />
          Big Jewellery Certificate
        </label>

        <button
          onClick={submitCertificate}
          className="bg-indigo-600 text-white px-5 py-2 rounded"
        >
          Submit
        </button>

        <button
          onClick={deleteSelected}
          className="bg-red-600 text-white px-5 py-2 rounded"
        >
          Delete Selected
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3">#</th>
              <th className="p-3">Confirmation</th>
              <th className="p-3">Service</th>
              <th className="p-3">Jobcard</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
              <th className="p-3">Big Certificate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={() => toggleRow(r.id)}
                  />
                </td>
                <td className="p-3">{(page - 1) * 10 + i + 1}</td>
                <td className="p-3">{r.confirmid}</td>
                <td className="p-3">{r.service}</td>
                <td className="p-3">{r.jobcardid}</td>
                <td
                  className="p-3 text-blue-600 cursor-pointer"
                  onClick={() => navigate(`/edit-job-card/${r.id}`)}
                >
                  Edit
                </td>
                <td
                  className="p-3 text-red-600 cursor-pointer"
                  onClick={() => deleteRow(r.id)}
                >
                  Delete
                </td>
                <td className="p-3 text-red-600 cursor-pointer">
                  {r.big_j == 1 ? "Yes" : "No"}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button disabled={page === 1} onClick={() => fetchData(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {lastPage}
        </span>
        <button
          disabled={page === lastPage}
          onClick={() => fetchData(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   IMAGE UPLOAD (BULK + PAGINATION)
===================================================== */

function JobCardImageUpload() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  /* ---------------- FETCH DATA ---------------- */
  const fetchRows = async (p = 1) => {
    const res = await api.get("/admin/jobcards", { params: { page: p } });
    setRows(res.data.data);
    setPage(res.data.current_page);
    setLastPage(res.data.last_page);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  /* ---------------- FILE SELECT ---------------- */
  const handleFileChange = (id, file) => {
    if (!file) return;
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
  };

  /* ---------------- SUBMIT ALL ---------------- */
  const submitAll = async () => {
    if (!Object.keys(selectedFiles).length) {
      return alert("Select at least one image");
    }

    const formData = new FormData();
    Object.entries(selectedFiles).forEach(([id, file]) => {
      formData.append(id, file);
    });

    await api.post("/admin/jobcards/images/bulk", formData);
    alert("Images uploaded successfully");

    setSelectedFiles({});
    fetchRows(page);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">🖼 Jewellery Card Image Upload</h2>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Confirmation</th>
              <th className="p-3">Jobcard</th>
              <th className="p-3 text-center">Image</th>
              <th className="p-3">Upload</th>
              <th className="p-3 text-center">Edit</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{(page - 1) * 10 + i + 1}</td>
                <td className="p-3">{r.confirmid}</td>
                <td className="p-3">{r.jobcardid}</td>

                {/* IMAGE ICON / PREVIEW */}
                <td className="p-3 text-center">
                  {r.image_url ? (
                    <img
                      src={r.image_url}
                      alt="jobcard"
                      className="w-10 h-10 object-cover rounded border mx-auto"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                  )}
                </td>

                {/* FILE INPUT */}
                <td className="p-3">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(r.id, e.target.files[0])}
                  />
                </td>

                {/* EDIT BUTTON */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => navigate(`/edit-job-card/${r.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Job Card"
                  >
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">
        <button
          onClick={submitAll}
          className="bg-gray-900 text-white px-6 py-2 rounded"
        >
          Submit All Images
        </button>

        {/* PAGINATION */}
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => fetchRows(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} / {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => fetchRows(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
