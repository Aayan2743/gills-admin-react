import { useEffect, useState } from "react";

export default function RateCardForm({ data, onClose, onSave }) {
  const [form, setForm] = useState({
    id: data?.id || null,
    service_id: data?.service_id || "",
    carat_from: data?.carat_from || "",
    carat_to: data?.carat_to || "",
    rate: data?.rate || "",
    unit: data?.unit || "p/pc",
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id || null,
        service_id: data.service_id || "",
        carat_from: data.carat_from || "",
        carat_to: data.carat_to || "",
        rate: data.rate || "",
        unit: data.unit || "p/pc",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 SEND CLEAN BACKEND PAYLOAD
    onSave({
      id: form.id,
      service_id: Number(form.service_id),
      carat_from: Number(form.carat_from),
      carat_to: form.carat_to ? Number(form.carat_to) : null,
      rate: Number(form.rate),
      unit: form.unit,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="font-semibold">
            {form.id ? "Edit Rate Card" : "Add Rate Card"}
          </h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* SERVICE */}
          <div className="">
            <label className="text-sm">Service</label>
            <input
              value={form.service_id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* CARAT FROM */}
          <div>
            <label className="text-sm">Carat From</label>
            <input
              type="number"
              step="0.01"
              name="carat_from"
              value={form.carat_from}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* CARAT TO */}
          <div>
            <label className="text-sm">Carat To (leave empty for Above)</label>
            <input
              type="number"
              step="0.01"
              name="carat_to"
              value={form.carat_to}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* RATE */}
          <div>
            <label className="text-sm">Rate (₹)</label>
            <input
              type="number"
              name="rate"
              value={form.rate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* UNIT */}
          <div>
            <label className="text-sm">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="p/pc">p/pc</option>
              <option value="p/ct">p/ct</option>
              <option value="p/pt">p/pt</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
