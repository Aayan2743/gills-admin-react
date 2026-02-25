import { useState, useEffect } from "react";
import api from "../api/axios";

// const ITEMS = ["Jewellery", "Loose diamond", "Gem Stone", "CVD"];

const ITEMS = [
  { id: 1, name: "Jewellery" },
  { id: 2, name: "Loose diamond" },
  { id: 3, name: "Gem Stone" },
  { id: 4, name: "CVD" },
];

export default function Confirmation() {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [rows, setRows] = useState([
    { item: "", pieces: "", weight: "", service_id: "" },
  ]);

  const [form, setForm] = useState({
    client_id: "",
    company_logo: 0,
    depositor_name: "",
    receiver_name: "",
    invoice_date: "",
    delivery_date: "",
  });

  const addRow = () => {
    setRows([...rows, { item: "", pieces: "", weight: "", service_id: "" }]);
  };

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await api.get("/admin/clients");

      let list = [];

      // handle both paginated & normal response
      if (Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data.data?.data)) {
        list = res.data.data.data;
      }

      setClients(list);
    } catch (err) {
      console.error("Client fetch error", err);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const updateRow = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    setRows(updated);
  };

  const handleSubmit = async () => {
    if (!form.client_id) {
      alert("Select client");
      return;
    }

    const items = rows
      .filter((r) => r.item && r.service_id)
      .map((r) => ({
        item: r.item,
        nop: r.pieces,
        weight: r.weight,
        service_id: r.service_id,
      }));

    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }

    const payload = {
      client_id: form.client_id,
      company_logo: form.company_logo,
      depositor_name: form.depositor_name,
      receiver_name: form.receiver_name,
      invoice_date: form.invoice_date,
      delivery_date: form.delivery_date,
      items,
    };

    try {
      const res = await api.post("/admin/job-confirmation", payload);
      alert(`Job Created: ${res.data.confirmationid}`);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get("/admin/services");

      if (res.data.status) {
        setServices(res.data.data);
      }
    } catch (err) {
      alert("Failed to load services");
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    // fetchServices();
    fetchServices();
    fetchClients();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Job Confirmation</h1>

      {/* CLIENT */}
      <div className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Client Name</label>
          <select
            className="input"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          >
            <option value="">- Select Client -</option>

            {loadingClients && <option>Loading clients...</option>}

            {!loadingClients &&
              Array.isArray(clients) &&
              clients.map((c) => (
                <option key={c.client_id} value={c.client_id}>
                  {c.client_name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="label">Client Banner Logo</label>
          <select
            className="input"
            onChange={(e) => setForm({ ...form, company_logo: e.target.value })}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-xl shadow mt-6">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Items Details</h2>
          <button
            onClick={addRow}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            + Add Item
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto px-4 py-4">
          <table className="w-full text-sm border-separate border-spacing-y-3">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-center w-12">#</th>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Pieces</th>
                <th className="px-3 py-2 text-left">Weight</th>
                <th className="px-3 py-2 text-left">Service</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="bg-white shadow-sm rounded-lg hover:shadow-md transition"
                >
                  {/* INDEX */}
                  <td className="px-3 py-3 text-center font-medium text-gray-700">
                    {i + 1}
                  </td>

                  {/* ITEM */}
                  <td className="px-3 py-3">
                    <select
                      className="input h-10 px-3"
                      onChange={(e) => updateRow(i, "item", e.target.value)}
                    >
                      <option value="">Select</option>
                      {ITEMS.map((it, idx) => (
                        <option key={idx} value={it.name}>
                          {it.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* PIECES */}
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      placeholder="0"
                      className="input h-10 px-3"
                      onChange={(e) => updateRow(i, "pieces", e.target.value)}
                    />
                  </td>

                  {/* WEIGHT */}
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input h-10 px-3"
                      onChange={(e) => updateRow(i, "weight", e.target.value)}
                    />
                  </td>

                  {/* SERVICE */}
                  <td className="px-3 py-3">
                    <select
                      className="input h-10 px-3"
                      value={row.service_id}
                      onChange={(e) =>
                        updateRow(i, "service_id", e.target.value)
                      }
                    >
                      <option value="">- Select Service -</option>

                      {loadingServices && (
                        <option disabled>Loading services...</option>
                      )}

                      {!loadingServices &&
                        services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELIVERY */}
      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Depositor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Depositor Name
          </label>
          <input
            type="text"
            value={form.depositor_name}
            onChange={(e) =>
              setForm({ ...form, depositor_name: e.target.value })
            }
            placeholder="Enter depositor name"
            className="input"
          />
        </div>

        {/* Receiver Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receiver Name
          </label>
          <input
            type="text"
            value={form.receiver_name}
            onChange={(e) =>
              setForm({ ...form, receiver_name: e.target.value })
            }
            placeholder="Enter receiver name"
            className="input"
          />
        </div>

        {/* Invoice Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date
          </label>
          <input
            type="date"
            value={form.invoice_date}
            onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
            className="input"
          />
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Date
          </label>
          <input
            type="date"
            value={form.delivery_date}
            onChange={(e) =>
              setForm({ ...form, delivery_date: e.target.value })
            }
            className="input"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="border px-6 py-2 rounded">Cancel</button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Submit Job
        </button>
      </div>
    </div>
  );
}
