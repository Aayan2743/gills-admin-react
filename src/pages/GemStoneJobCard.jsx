import { useState, useEffect } from "react";

import api from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function GemStoneJobCard() {
  const [activeTab, setActiveTab] = useState("entry");

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <h1 className="text-xl font-semibold flex items-center gap-2">
        📁 Gem Stone Job Card
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

// function JobCardEntry() {
//   return (
//     <div className="bg-white p-6 rounded shadow space-y-4">
//       <h2 className="font-semibold text-lg">
//         📄 Gem Stone Job Card Entry Form
//       </h2>

//       <div className="flex items-center gap-4">
//         <input type="file" className="border rounded px-3 py-2" />
//         <button className="bg-gray-800 text-white px-6 py-2 rounded">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

function JobCardEntry() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/admin/gemstone/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="font-semibold text-lg">
        📄 Gem Stone Job Card Entry Form
      </h2>

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gray-800 text-white px-6 py-2 rounded"
        >
          {loading ? "Uploading..." : "Submit"}
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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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

  const submitCertificate = () => {
    if (!selected.length) {
      return alert("Select at least one job card");
    }

    if (!imageCert && !bigJewellery) {
      return alert("Select at least one certificate type");
    }

    navigate("/gemstone/certificates/preview", {
      state: {
        jobcard_ids: selected,
        image_certificate: imageCert,
        big_jewellery: bigJewellery,
      },
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    fetchJobCards(1);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">📋 Gem Stone Job Card List</h2>

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
        <a
          href="/excels/two.csv" // file inside public folder
          download
          className="ml-auto px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Excel
        </a>
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

        <button
          onClick={submitCertificate}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
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
                  <td className="p-3">{(page - 1) * 10 + i + 1}</td>
                  <td className="p-3">{row.confirmid}</td>
                  <td className="p-3">{row.gjobcardid}</td>
                  <td
                    className="p-3 text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/edit-gem-stone-job-card/${row.gjobcard_id}`)
                    }
                  >
                    Edit
                  </td>
                  <td className="p-3 text-red-600 cursor-pointer">Delete</td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(row.gjobcard_id)}
                      onChange={() => toggleSelect(row.gjobcard_id)}
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
  const [data, setData] = useState([]);
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (pageNo = 1) => {
    try {
      const res = await api.get("/admin/gemstone-jobcards", {
        params: { page: pageNo },
      });

      setData(res.data.data);
      setPage(res.data.pagination.current_page);
      setLastPage(res.data.pagination.last_page);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (id, file) => {
    setFiles((prev) => ({
      ...prev,
      [id]: file,
    }));

    if (file) {
      setPreviews((prev) => ({
        ...prev,
        [id]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(files).forEach((id) => {
      formData.append("jobid[]", id);
      formData.append("img[]", files[id]);
    });

    try {
      setLoading(true);

      await api.post("/admin/gemstone/multi-image-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Images Uploaded Successfully");

      setFiles({});
      setPreviews({});
      fetchData(page);
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold border-b pb-3">
        🖼 Bulk Gemstone Image Upload
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Confirmation</th>
              <th className="p-3">Jobcard</th>
              <th className="p-3">Current Image</th>
              <th className="p-3">Upload New</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={row.gjobcard_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{(page - 1) * 10 + i + 1}</td>

                <td className="p-3 font-medium">{row.confirmid}</td>

                <td className="p-3">{row.gjobcardid}</td>

                <td className="p-3">
                  {row.image_url ? (
                    <img
                      src={row.image_url}
                      alt="Current"
                      className="h-16 w-16 object-cover rounded-lg border shadow"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </td>

                <td className="p-3 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(row.gjobcard_id, e.target.files[0])
                    }
                  />

                  {previews[row.gjobcard_id] && (
                    <img
                      src={previews[row.gjobcard_id]}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-lg border"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:opacity-90"
        >
          {loading ? "Uploading..." : "Upload Selected Images"}
        </button>
      </div>
    </div>
  );
}

// function JobCardImageUpload() {
//   return (
//     <div className="space-y-4">
//       <h2 className="font-semibold text-lg">
//         🖼 Gem Stone Job Card Image Upload
//       </h2>

//       {/* SEARCH */}
//       <div className="flex gap-4 bg-gray-50 p-4 rounded">
//         <input
//           placeholder="Old Confirmation Number"
//           className="border px-3 py-2 rounded"
//         />
//         <button className="bg-gray-800 text-white px-4 py-2 rounded">
//           Submit
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white shadow rounded overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-[#b08a5a] text-white">
//             <tr>
//               <th className="p-3">SNo</th>
//               <th className="p-3">Confirmation No</th>
//               <th className="p-3">Jobcard Id</th>
//               <th className="p-3">Edit</th>
//               <th className="p-3">File Upload</th>
//               <th className="p-3">Filename</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[1, 2, 3].map((i) => (
//               <tr key={i} className="border-t">
//                 <td className="p-3">{i}</td>
//                 <td className="p-3">GILCNF77{i}</td>
//                 <td className="p-3">GILHJ309{i}K</td>
//                 <td className="p-3 text-blue-600 cursor-pointer">edit</td>
//                 <td className="p-3">
//                   <input type="file" />
//                 </td>
//                 <td className="p-3 text-gray-500">—</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
