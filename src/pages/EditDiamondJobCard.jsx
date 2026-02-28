import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDiamondJobCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    confirmid: "",
    djobcardid: "",
    service: "",
    cut: "",
    carat: "",
    nop: "",
    measure: "",
    clarity: "",
    color: "",
    florosense: "",
    finish: "",
    table: "",
    crown: "",
    pavilion: "",
    culet: "",
    girdle: "",
    big_d: "",
    created: "",
  });

  const [services, setServices] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [clarities, setClarities] = useState([]);
  const [colors, setColors] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services"); // no /admin needed if api prefix
      setServices(res.data.data || []);
    } catch (err) {
      console.error("Service load error", err);
    }
  };

  useEffect(() => {
    fetchServices();
    if (id) fetchJobCard();
  }, [id]);

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchMaster();
    if (id) fetchJobCard();
  }, [id]);

  const fetchMaster = async () => {
    const res = await api.get("/admin/master-data");
    setServices(res.data.services || []);
    setCuts(res.data.cuts || []);
    setClarities(res.data.clarities || []);
    setColors(res.data.colors || []);
  };

  const fetchJobCard = async () => {
    const res = await api.get(`/admin/diamond-jobcards/${id}`);
    setForm(res.data.data);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.put(`/admin/diamond-jobcards/${id}`, form);

      alert("Updated successfully");
      navigate(-1);
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold border-b pb-3">
        ✏ Diamond Job Card Edit
      </h2>

      <FormInput
        label="confirm id"
        name="confirmid"
        value={form.confirmid}
        onChange={handleChange}
      />

      <FormInput
        label="Diamond job card no"
        name="djobcardid"
        value={form.djobcardid}
        onChange={handleChange}
      />

      {/* SERVICE */}
      <FormSelect
        label="service"
        name="service"
        value={form.service}
        options={services}
        onChange={handleChange}
      />

      {/* CUT */}
      <FormSelect
        label="cut"
        name="cut"
        value={form.cut}
        options={cuts}
        onChange={handleChange}
        valueKey="cut_id"
        labelKey="code"
      />

      <FormInput
        label="carat"
        name="carat"
        value={form.carat}
        onChange={handleChange}
      />

      <FormInput
        label="nop"
        name="nop"
        value={form.nop}
        onChange={handleChange}
      />

      <FormInput
        label="measure"
        name="measure"
        value={form.measure}
        onChange={handleChange}
      />

      {/* CLARITY */}
      <FormSelect
        label="clarity"
        name="clarity"
        value={form.clarity}
        options={clarities}
        onChange={handleChange}
        valueKey="calrity_id"
        labelKey="Clarity"
      />

      {/* COLOR */}
      <FormSelect
        label="color"
        name="color"
        value={form.color}
        options={colors}
        onChange={handleChange}
        valueKey="color_id"
        labelKey="color_code"
      />

      <FormInput
        label="florosence"
        name="florosense"
        value={form.florosense}
        onChange={handleChange}
      />

      <FormInput
        label="finish"
        name="finish"
        value={form.finish}
        onChange={handleChange}
      />

      <FormInput
        label="table"
        name="table"
        value={form.table}
        onChange={handleChange}
      />

      <FormInput
        label="crown"
        name="crown"
        value={form.crown}
        onChange={handleChange}
      />

      <FormInput
        label="pavilion"
        name="pavilion"
        value={form.pavilion}
        onChange={handleChange}
      />

      <FormInput
        label="culet"
        name="culet"
        value={form.culet}
        onChange={handleChange}
      />

      <FormInput
        label="girdle"
        name="girdle"
        value={form.girdle}
        onChange={handleChange}
      />

      <FormInput
        label="Another Format Card"
        name="big_d"
        value={form.big_d}
        onChange={handleChange}
      />

      <FormInput
        label="created"
        name="created"
        value={form.created}
        onChange={handleChange}
      />

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium capitalize mb-1">
        {label} :
      </label>
      <input {...props} className="w-full border rounded px-3 py-2" />
    </div>
  );
}

/* ================= SELECT COMPONENT ================= */
function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  valueKey = "id",
  labelKey = "name",
}) {
  return (
    <div>
      <label className="block text-sm font-medium capitalize mb-1">
        {label} :
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select {label}</option>

        {options.map((item) => (
          <option key={item[valueKey]} value={item[valueKey] || item}>
            {item[labelKey] || item}
          </option>
        ))}
      </select>
    </div>
  );
}
