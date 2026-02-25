import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditGemJobCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    confirmid: "",
    gjobcardid: "",
    service: "",
    species: "",
    variety: "",
    shape: "",
    carat: "",
    measure: "",
    transperancy: "",
    stamped: "",
    comments: "",
  });

  const [cuts, setCuts] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchCuts();
    if (id) fetchJobCard();
  }, [id]);

  /* ================= MASTER DATA (CUTS ONLY) ================= */
  const fetchCuts = async () => {
    try {
      const res = await api.get("admin/master-data");
      setCuts(res.data.cuts || []);
    } catch (err) {
      console.error("Error loading cuts", err);
    }
  };

  /* ================= LOAD JOB CARD (EDIT) ================= */
  const fetchJobCard = async () => {
    try {
      const res = await api.get(`/admin/gemstone-jobcards/${id}`);
      const data = res.data.data;

      setForm({
        confirmid: data.confirmid || "",
        gjobcardid: data.gjobcardid || "",
        service: data.service || "",
        species: data.species || "",
        variety: data.variety || "",
        shape: data.shape || "",
        carat: data.carat || "",
        measure: data.measure || "",
        transperancy: data.transperancy || "",
        stamped: data.stamped || "",
        comments: data.comments || "",
      });

      if (data.image) {
        setPreview(
          `${import.meta.env.VITE_API_BASE_URL}/gil_images/${data.image}`
        );
      }
    } catch (err) {
      console.error("Error loading job card", err);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async () => {
  setLoading(true);

  const fd = new FormData();
  Object.entries(form).forEach(([key, value]) =>
    fd.append(key, value ?? "")
  );
  if (image) fd.append("image", image);

  try {
    if (id) {
      await api.post(
        `/admin/update-gemstone-jobcards/${id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Job card updated successfully");
    } else {
      await api.post(
        `/admin/gemstone-jobcards`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Job card created successfully");
    }

    navigate(-1);
  } catch (err) {
    if (err.response?.status === 422) {
      console.error("Validation errors:", err.response.data.errors);
      alert("Validation error");
    } else {
      console.error(err);
      alert("Something went wrong");
    }
  }

  setLoading(false);
};


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="font-semibold text-xl border-b pb-3">
        ✏️ Gem Job Card
      </h2>

      {/* ================= FORM GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Input label="Confirm ID" name="confirmid" value={form.confirmid} onChange={handleChange} />
        <Input label="Gem Job Card Number" name="gjobcardid" value={form.gjobcardid} onChange={handleChange} />
        <Input label="Service" name="service" value={form.service} onChange={handleChange} />
        <Input label="Species" name="species" value={form.species} onChange={handleChange} />
        <Input label="Variety" name="variety" value={form.variety} onChange={handleChange} />

        {/* CUT */}
        <div>
          <label className="text-sm font-medium">Cut</label>
          <select
            name="shape"
            value={form.shape}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          >
            <option value="">Select Cut</option>
            {cuts.map((cut) => (
              <option key={cut.cut_id} value={String(cut.cut_id)}>
                {cut.code}
              </option>
            ))}
          </select>
        </div>

        <Input label="Carat" name="carat" type="number" step="0.01" value={form.carat} onChange={handleChange} />
        <Input label="Measure" name="measure" value={form.measure} onChange={handleChange} />
        <Input label="Transparency" name="transperancy" value={form.transperancy} onChange={handleChange} />

        {/* STAMPED */}
        <Textarea
          label="Stamped"
          name="stamped"
          value={form.stamped}
          onChange={handleChange}
        />

        {/* COMMENTS */}
        <Textarea
          label="Comments"
          name="comments"
          value={form.comments}
          onChange={handleChange}
        />

        {/* IMAGE UPLOAD + PREVIEW */}
        <div>
          <label className="text-sm font-medium">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="block w-full border rounded-lg px-3 py-2 mt-1"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-24 w-24 object-cover rounded border"
            />
          )}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg border">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-slate-800 text-white px-8 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

/* ================= TEXTAREA ================= */
function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        {...props}
        rows="3"
        className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
