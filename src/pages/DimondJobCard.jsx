import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
export default function DimondJobCard() {
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
      <h2 className="font-semibold text-lg">📄 Dimond Job Card Entry Form</h2>

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

  const [rows, setRows] = useState([]);
  const [confirmid, setConfirmid] = useState("");
  const [jobcardid, setJobcardid] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [imageCert, setImageCert] = useState(false);
  const [bigJewelleryCert, setBigJewelleryCert] = useState(false);

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((r) => r.djobcard_id));
    }
    setSelectAll(!selectAll);
  };
  /* ================= DELETE ================= */
  const deleteSelected = async () => {
    if (!selectedIds.length) {
      return alert("Select at least one job card");
    }

    if (!window.confirm("Delete selected job cards?")) return;

    try {
      await api.post("/admin/diamond-jobcards/bulk-delete", {
        ids: selectedIds,
      });

      fetchData(page);
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      alert("Delete failed");
    }
  };
  /* ================= CERTIFICATE ================= */
  const submitCertificate = () => {
    if (!selectedIds.length) {
      return alert("Select at least one job card");
    }

    if (!imageCert && !bigJewelleryCert) {
      return alert("Select certificate type");
    }

    navigate("/diamond-certificates/preview", {
      state: {
        jobcard_ids: selectedIds,
        image_certificate: imageCert,
        big_jewellery: bigJewelleryCert,
      },
    });
  };

  /* ================= FETCH DATA ================= */
  const fetchData = async (p = 1) => {
    try {
      setLoading(true);

      const res = await api.get("/admin/diamond-jobcards", {
        params: {
          confirmid,
          djobcardid: jobcardid,
          page: p,
        },
      });

      setRows(res.data.data);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await api.delete(`/admin/diamond-jobcards/${id}`);
      fetchData(page);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">📋 Diamond Job Card List</h2>

      {/* ================= FILTER ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
        <input
          placeholder="Confirmation Number"
          value={confirmid}
          onChange={(e) => setConfirmid(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Job Card Id"
          value={jobcardid}
          onChange={(e) => setJobcardid(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={() => fetchData(1)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        <button
          onClick={() => {
            setConfirmid("");
            setJobcardid("");
            fetchData(1);
          }}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* ================= ACTION BAR ================= */}
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
          className="bg-indigo-600 text-white px-5 py-2 rounded shadow"
        >
          Submit
        </button>

        <button
          onClick={deleteSelected}
          className="bg-red-600 text-white px-5 py-2 rounded shadow"
        >
          Delete Selected
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#b08a5a] text-white">
            <tr>
              <th className="p-3">SNo</th>
              <th className="p-3">Confirmation No</th>
              <th className="p-3">Jobcard Id</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
              <th className="p-3">Select</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}

            {rows.map((row, index) => (
              <tr key={row.djobcard_id} className="border-t">
                <td className="p-3">{(page - 1) * 10 + index + 1}</td>

                <td className="p-3">{row.confirmid}</td>

                <td className="p-3">{row.djobcardid}</td>

                <td
                  className="p-3 text-blue-600 cursor-pointer"
                  onClick={() =>
                    navigate(`/edit-diamond-jobcard/${row.djobcard_id}`)
                  }
                >
                  Edit
                </td>

                <td
                  className="p-3 text-red-600 cursor-pointer"
                  onClick={() => handleDelete(row.djobcard_id)}
                >
                  Delete
                </td>

                <td className="p-3">
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-end items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => fetchData(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => fetchData(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// function JobCardImageUpload() {
//   const [jobcards, setJobcards] = useState([]);
//   const [loadingId, setLoadingId] = useState(null);

//   useEffect(() => {
//     fetchJobcards();
//   }, []);

//   const fetchJobcards = async () => {
//     const res = await api.get("/admin/diamond-jobcards");
//     setJobcards(res.data.data || []);
//   };

//   const handleImageUpload = async (e, id) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("id", id);
//     formData.append("image", file);

//     try {
//       setLoadingId(id);

//       await api.post("/admin/diamond-jobcards/image-upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       fetchJobcards();
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="font-semibold text-lg">🖼 Bulk Diamond Image Upload</h2>

//       <div className="bg-white shadow rounded overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
//             <tr>
//               <th className="p-3">#</th>
//               <th className="p-3">Confirmation</th>
//               <th className="p-3">Jobcard</th>
//               <th className="p-3">Current Image</th>
//               <th className="p-3">Upload New</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobcards.map((item, index) => (
//               <tr key={item.djobcard_id} className="border-t">
//                 <td className="p-3">{index + 1}</td>
//                 <td className="p-3 font-semibold">{item.confirmid}</td>
//                 <td className="p-3">{item.djobcardid}</td>

//                 {/* CURRENT IMAGE */}
//                 <td className="p-3">
//                   {item.image ? (
//                     <img
//                       src={`http://localhost/storage/diamond/${item.image}`}
//                       alt="Current"
//                       className="h-16 w-16 object-cover rounded shadow"
//                     />
//                   ) : (
//                     <span className="text-gray-400">No Image</span>
//                   )}
//                 </td>

//                 {/* UPLOAD NEW */}
//                 <td className="p-3">
//                   <input
//                     type="file"
//                     onChange={(e) => handleImageUpload(e, item.djobcard_id)}
//                   />
//                   {loadingId === item.djobcard_id && (
//                     <p className="text-xs text-blue-600 mt-1">Uploading...</p>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

function JobCardImageUpload() {
  const [jobcards, setJobcards] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchJobcards(currentPage);
  }, [currentPage]);

  const fetchJobcards = async (page = 1) => {
    const res = await api.get(`/admin/diamond-jobcards?page=${page}`);

    setJobcards(res.data.data || []);
    setCurrentPage(res.data.current_page);
    setLastPage(res.data.last_page);
  };

  const handleFileChange = (e, id) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [id]: e.target.files[0],
    }));
  };

  const handleBulkUpload = async () => {
    if (Object.keys(selectedFiles).length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();

    Object.keys(selectedFiles).forEach((id) => {
      formData.append("jobid[]", id);
      formData.append("img[]", selectedFiles[id]);
    });

    try {
      setLoading(true);

      const res = await api.post(
        "/admin/diamond-jobcards/multi-image-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      alert(res.data.message || "Images Uploaded Successfully");

      setSelectedFiles({}); // clear selected files
      fetchJobcards(currentPage); // refresh current page
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl flex items-center gap-2">
        🖼 Bulk Diamond Image Upload
      </h2>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Confirmation</th>
              <th className="p-3 text-left">Jobcard</th>
              <th className="p-3 text-center">Current Image</th>
              <th className="p-3 text-left">Upload New</th>
            </tr>
          </thead>
          <tbody>
            {jobcards.map((item, index) => (
              <tr key={item.djobcard_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{item.confirmid}</td>
                <td className="p-3">{item.djobcardid}</td>

                {/* CURRENT IMAGE */}
                <td className="p-3 text-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt="current"
                      className="h-16 w-16 object-cover rounded shadow mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </td>

                {/* FILE INPUT */}
                <td className="p-3">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, item.djobcard_id)}
                    className="text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BUTTON BOTTOM RIGHT */}
      <div className="flex justify-end">
        <button
          onClick={handleBulkUpload}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90"
        >
          {loading ? "Uploading..." : "Upload Selected Images"}
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {lastPage}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
