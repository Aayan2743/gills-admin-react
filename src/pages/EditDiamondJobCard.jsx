// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditDiamondJobCard() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     confirmid: "",
//     djobcardid: "",
//     service: "",
//     cut: "",
//     carat: "",
//     nop: "",
//     measure: "",
//     clarity: "",
//     color: "",
//     florosense: "",
//     finish: "",
//     table: "",
//     crown: "",
//     pavilion: "",
//     culet: "",
//     girdle: "",
//     big_d: "",
//     created: "",
//   });

//   const [services, setServices] = useState([]);
//   const [cuts, setCuts] = useState([]);
//   const [clarities, setClarities] = useState([]);
//   const [colors, setColors] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const fetchServices = async () => {
//     try {
//       const res = await api.get("/admin/services"); // no /admin needed if api prefix
//       console.log("Services loaded", res.data.data);
//       setServices(res.data.data || []);
//     } catch (err) {
//       console.error("Service load error", err);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//     if (id) fetchJobCard();
//   }, [id]);

//   /* ================= LOAD ================= */
//   useEffect(() => {
//     fetchMaster();
//     if (id) fetchJobCard();
//   }, [id]);

//   const fetchMaster = async () => {
//     const res = await api.get("/admin/master-data");
//     // setServices(res.data.services || []);
//     setCuts(res.data.cuts || []);
//     setClarities(res.data.clarities || []);
//     setColors(res.data.colors || []);
//   };

//   const fetchJobCard = async () => {
//     try {
//       const res = await api.get(`/admin/diamond-jobcards/${id}`);
//       console.log("JobCard:", res.data);

//       if (res.data && res.data.data) {
//         setForm({
//           ...form,
//           ...res.data.data,
//         });
//       }
//     } catch (err) {
//       console.error("JobCard load error", err);
//     }
//   };

//   /* ================= HANDLE CHANGE ================= */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       await api.put(`/admin/diamond-jobcards/${id}`, form);

//       alert("Updated successfully");
//       navigate(-1);
//     } catch (err) {
//       alert("Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
//       <h2 className="text-xl font-semibold border-b pb-3">
//         ✏ Diamond Job Card Edit
//       </h2>

//       <FormInput
//         label="confirm id"
//         name="confirmid"
//         value={form.confirmid}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="Diamond job card no"
//         name="djobcardid"
//         value={form.djobcardid}
//         onChange={handleChange}
//       />

//       {/* SERVICE */}
//       <FormSelect
//         label="service"
//         name="service"
//         value={form.service}
//         options={services}
//         onChange={handleChange}
//         valueKey="name"
//         labelKey="name"
//       />

//       {/* CUT */}
//       <FormSelect
//         label="cut"
//         name="cut"
//         value={form.cut}
//         options={cuts}
//         onChange={handleChange}
//         valueKey="cut_id"
//         labelKey="code"
//       />

//       <FormInput
//         label="carat"
//         name="carat"
//         value={form.carat}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="nop"
//         name="nop"
//         value={form.nop}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="measure"
//         name="measure"
//         value={form.measure}
//         onChange={handleChange}
//       />

//       {/* CLARITY */}
//       <FormSelect
//         label="clarity"
//         name="clarity"
//         value={form.clarity}
//         options={clarities}
//         onChange={handleChange}
//         valueKey="calrity_id"
//         labelKey="Clarity"
//       />

//       {/* COLOR */}
//       <FormSelect
//         label="color"
//         name="color"
//         value={form.color}
//         options={colors}
//         onChange={handleChange}
//         valueKey="color_id"
//         labelKey="color_code"
//       />

//       <FormInput
//         label="florosence"
//         name="florosense"
//         value={form.florosense}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="finish"
//         name="finish"
//         value={form.finish}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="table"
//         name="table"
//         value={form.table}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="crown"
//         name="crown"
//         value={form.crown}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="pavilion"
//         name="pavilion"
//         value={form.pavilion}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="culet"
//         name="culet"
//         value={form.culet}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="girdle"
//         name="girdle"
//         value={form.girdle}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="Another Format Card"
//         name="big_d"
//         value={form.big_d}
//         onChange={handleChange}
//       />

//       <FormInput
//         label="created"
//         name="created"
//         value={form.created}
//         onChange={handleChange}
//       />

//       <div className="flex justify-end pt-4 border-t">
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-black text-white px-6 py-2 rounded"
//         >
//           {loading ? "Saving..." : "Submit"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ================= INPUT COMPONENT ================= */
// function FormInput({ label, ...props }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium capitalize mb-1">
//         {label} :
//       </label>
//       <input {...props} className="w-full border rounded px-3 py-2" />
//     </div>
//   );
// }

// /* ================= SELECT COMPONENT ================= */
// function FormSelect({
//   label,
//   name,
//   value,
//   options,
//   onChange,
//   valueKey = "id",
//   labelKey = "name",
// }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium capitalize mb-1">
//         {label} :
//       </label>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border rounded px-3 py-2"
//       >
//         <option value="">Select {label}</option>

//         {options.map((item) => (
//           <option key={item[valueKey]} value={item[valueKey] || item}>
//             {item[labelKey] || item}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

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
    rate: "",
    dia: "",
    total: "",
    nop: "",
    cut: "",
    carat: "",
    measure: "",
    clarity: "",
    color: "",
    florosense: "",
    finish: "",
    tble: "", // ✅ correct column
    crown: "",
    pavilion: "",
    culet: "",
    girdle: "",
    big_d: "0",
  });

  const [services, setServices] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [clarities, setClarities] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaster();
    if (id) fetchJobCard();
  }, [id]);

  useEffect(() => {
    fetchServices();
    if (id) fetchJobCard();
  }, [id]);

  const fetchMaster = async () => {
    const res = await api.get("/admin/master-data");

    // setServices(res.data.services || []);
    setCuts(res.data.cuts || []);
    setClarities(res.data.clarities || []);
    setColors(res.data.colors || []);
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/admin/services"); // no /admin needed if api prefix
      console.log("Services loaded", res.data.data);
      setServices(res.data.data || []);
    } catch (err) {
      console.error("Service load error", err);
    }
  };

  const fetchJobCard = async () => {
    const res = await api.get(`/admin/diamond-jobcards/${id}`);
    if (res.data.data) {
      setForm(res.data.data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        label="Confirm ID"
        name="confirmid"
        value={form.confirmid}
        onChange={handleChange}
      />
      <FormInput
        label="Jobcard No"
        name="djobcardid"
        value={form.djobcardid}
        onChange={handleChange}
      />
      {/* <FormInput
        label="Rate"
        name="rate"
        value={form.rate}
        onChange={handleChange}
      />
      <FormInput
        label="Dia"
        name="dia"
        value={form.dia}
        onChange={handleChange}
      />
      <FormInput
        label="Total"
        name="total"
        value={form.total}
        onChange={handleChange}
      /> */}
      <FormInput
        label="NOP"
        name="nop"
        value={form.nop}
        onChange={handleChange}
      />
      <FormInput
        label="Carat"
        name="carat"
        value={form.carat}
        onChange={handleChange}
      />
      <FormInput
        label="Measure"
        name="measure"
        value={form.measure}
        onChange={handleChange}
      />
      <FormInput
        label="Fluorescence"
        name="florosense"
        value={form.florosense}
        onChange={handleChange}
      />
      <FormInput
        label="Finish"
        name="finish"
        value={form.finish}
        onChange={handleChange}
      />
      <FormInput
        label="Table %"
        name="tble"
        value={form.tble}
        onChange={handleChange}
      />
      <FormInput
        label="Crown"
        name="crown"
        value={form.crown}
        onChange={handleChange}
      />
      <FormInput
        label="Pavilion"
        name="pavilion"
        value={form.pavilion}
        onChange={handleChange}
      />
      <FormInput
        label="Culet"
        name="culet"
        value={form.culet}
        onChange={handleChange}
      />
      <FormInput
        label="Girdle"
        name="girdle"
        value={form.girdle}
        onChange={handleChange}
      />

      <FormSelect
        label="Service"
        name="service"
        value={form.service}
        options={services}
        onChange={handleChange}
        valueKey="name"
        labelKey="name"
      />

      <FormSelect
        label="Cut"
        name="cut"
        value={form.cut}
        options={cuts}
        onChange={handleChange}
        valueKey="code"
        labelKey="code"
      />

      <FormSelect
        label="Clarity"
        name="clarity"
        value={form.clarity}
        options={clarities}
        onChange={handleChange}
        valueKey="id"
        labelKey="Clarity"
      />

      <FormSelect
        label="Color"
        name="color"
        value={form.color}
        options={colors}
        onChange={handleChange}
        valueKey="color_code"
        labelKey="color_code"
      />

      <FormSelect
        label="Big D"
        name="big_d"
        value={form.big_d}
        options={[
          { id: "0", name: "No" },
          { id: "1", name: "Yes" },
        ]}
        onChange={handleChange}
        valueKey="id"
        labelKey="name"
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

function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label} :</label>
      <input {...props} className="w-full border rounded px-3 py-2" />
    </div>
  );
}

function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  valueKey,
  labelKey,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label} :</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select {label}</option>
        {options.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
}
