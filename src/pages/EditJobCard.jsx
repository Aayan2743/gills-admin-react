import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import { successAlert, handleApiError } from "../utils/alert";

/* ---------------- STATIC ITEM OPTIONS ---------------- */
const ITEM_OPTIONS = [
  { id: "Ring", label: "Ring" },
  { id: "Nosepin", label: "Nosepin" },
  { id: "Bangle", label: "Bangle" },
  { id: "Pair of Bangles", label: "Pair of Bangles" },
  { id: "Necklace", label: "Necklace" },
  { id: "Necklace & Pair of Earrings", label: "Necklace & Pair of Earrings" },
  { id: "Pair of Earrings", label: "Pair of Earrings" },
  { id: "Bracelet", label: "Bracelet" },
  { id: "Pendant", label: "Pendant" },
  { id: "Pendant & Earrings", label: "Pendant & Earrings" },
  { id: "Jewellery", label: "Jewellery" },
  { id: "Set of Bangles", label: "Set of Bangles" },
];
export default function EditJobCard() {
  const { id } = useParams();
  const jobcardId = id;

  /* ---------------- MASTER DATA ---------------- */
  const [masters, setMasters] = useState({
    services: [],
    metals: [],
    clarities: [],
    colors: [],
    cuts: [],
  });

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    jobcardid: "",
    confirmid: "",
    service: "",
    item: "",
    grwt: "",
    estwt: "",
    metal: "",
    calrity: "",
    color: "",
    cut: "",
    nol: "",
    big_j: "0",
    comments: "", // ✅ NEW
    Stamped: "",
    image: null,
    imagePreview: null,
  });

  /* ---------------- FETCH JOB CARD ---------------- */
  useEffect(() => {
    if (!jobcardId) return;

    api.get(`/admin/jobcards/${jobcardId}`).then((res) => {
      setForm({
        ...res.data,
        imagePreview: res.data.image_url || null,
      });
    });
  }, [jobcardId]);

  /* ---------------- FETCH MASTER DATA ---------------- */
  // SERVICES
  useEffect(() => {
    api.get("/admin/services").then((res) => {
      setMasters((prev) => ({
        ...prev,
        services: res.data.data,
      }));
    });
  }, []);

  // OTHER MASTER DATA
  useEffect(() => {
    api.get("/admin/master-data").then((res) => {
      setMasters((prev) => ({
        ...prev,
        ...res.data,
      }));
    });
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmits = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "image") {
        // ✅ Only append if user selected a NEW file
        if (form.image instanceof File) {
          formData.append("image", form.image);
        }
      } else if (key !== "imagePreview") {
        formData.append(key, form[key] ?? "");
      }
    });

    await api.post(`/admin/jobcards/${jobcardId}`, formData);
    alert("Job Card updated successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "image") {
        // ✅ Only append if user selected a NEW file
        if (form.image instanceof File) {
          formData.append("image", form.image);
        }
      } else if (key !== "imagePreview") {
        formData.append(key, form[key] ?? "");
      }
    });

    try {
      const response = await api.post(`/admin/jobcards/${jobcardId}`, formData);

      // ✅ Success Alert
      successAlert(
        "Updated Successfully",
        response.data?.message || "Job Card updated successfully.",
      );
    } catch (error) {
      console.log("API Error:", error.response);

      // ✅ Reusable Error Handler
      handleApiError(error);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-6">✏️ Edit Jewellery Job Card</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <Input
          label="Job Card Number"
          name="jobcardid"
          value={form.jobcardid}
          onChange={handleChange}
        />
        <Input
          label="Confirmation Number"
          name="confirmid"
          value={form.confirmid}
          onChange={handleChange}
        />

        {/* SERVICE (API) */}
        <Select
          label="Service"
          name="service"
          value={form.service}
          onChange={handleChange}
          options={masters.services}
          labelKey="name"
          valueKey="name"
        />

        {/* ITEM (STATIC) */}
        <Select
          label="Item"
          name="item"
          value={form.item}
          onChange={handleChange}
          options={ITEM_OPTIONS}
          labelKey="label"
          valueKey="id"
        />

        <Input
          label="Gross Weight"
          name="grwt"
          type="number"
          step="0.01"
          value={form.grwt}
          onChange={handleChange}
        />
        <Input
          label="Estimate Weight"
          name="estwt"
          type="number"
          step="0.01"
          value={form.estwt}
          onChange={handleChange}
        />

        {/* METAL */}
        <Select
          label="Metal"
          name="metal"
          value={form.metal}
          onChange={handleChange}
          options={masters.metals}
          labelKey="code"
          valueKey="id"
        />

        {/* CLARITY */}
        <Select
          label="Clarity"
          name="calrity"
          value={form.calrity}
          onChange={handleChange}
          options={masters.clarities}
          labelKey="Clarity"
          valueKey="id"
        />

        {/* COLOR */}
        <Select
          label="Color"
          name="color"
          value={form.color}
          onChange={handleChange}
          options={masters.colors}
          labelKey="color_code"
          valueKey="color_id"
        />

        {/* CUT */}
        <Select
          label="Cut"
          name="cut"
          value={form.cut}
          onChange={handleChange}
          options={masters.cuts}
          labelKey="code"
          valueKey="cut_id"
        />

        <Input
          label="Big Jewellery (0 / 1)"
          name="big_j"
          value={form.big_j}
          onChange={handleChange}
        />
        <Input
          label="No of Diamonds"
          name="nol"
          type="number"
          value={form.nol}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Comments</label>
          <textarea
            name="comments"
            rows={3}
            value={form.comments}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter certificate comments"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Stamped / Certification Note
          </label>
          <textarea
            name="stamped"
            rows={2}
            value={form.Stamped}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter stamped / approval text"
          />
        </div>

        {/* IMAGE */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Image</label>

          {form.imagePreview && (
            <img
              src={form.imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover border rounded mb-2"
            />
          )}

          <input type="file" onChange={handleImage} />
        </div>

        {/* SUBMIT */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded"
          >
            Update Job Card
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded px-3 py-2" />
    </div>
  );
}

function Select({ label, options = [], labelKey, valueKey = "id", ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select {...rest} className="w-full border rounded px-3 py-2">
        <option value="">- Select Service -</option>
        {options.map((op) => (
          <option key={op[valueKey]} value={op[valueKey]}>
            {op[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
}
