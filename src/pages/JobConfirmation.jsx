import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function JobConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [form, setForm] = useState({
    client_id: "",
    company_logo: 0,
    depositor_name: "",
    receiver_name: "",
    invoice_date: "",
    delivery_date: "",
    items: [{ item: "", nop: "", weight: "", service_id: "" }],
  });

  /* ================= LOAD CLIENTS ================= */
  const fetchClients = async () => {
    try {
      const res = await api.get("/admin/clients");

      // 🔒 HARD SAFETY CHECK
      let list = [];

      if (Array.isArray(res.data.data)) {
        // non-paginated
        list = res.data.data;
      } else if (Array.isArray(res.data.data?.data)) {
        // paginated
        list = res.data.data.data;
      }

      setClients(list);
    } catch (err) {
      console.error("Client fetch error", err);
      setClients([]); // never break UI
    }
  };

  /* ================= LOAD CONFIRMATION (EDIT) ================= */
  const fetchConfirmation = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/job-confirmation/${id}`);
      const d = res.data.data;

      setForm({
        client_id: d.client_id,
        company_logo: d.company_logo ?? 0,
        depositor_name: d.depositer_name ?? "",
        receiver_name: d.reciever ?? "",
        invoice_date: d.invoicedate ?? "",
        delivery_date: d.deliverydate ?? "",
        items: d.items.map((i) => ({
          item: i.item,
          nop: i.nop,
          weight: i.weight,
          service_id: i.services,
        })),
      });
    } catch {
      alert("Failed to load confirmation");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get("/admin/services");

      let list = [];

      if (Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data.data?.data)) {
        list = res.data.data.data;
      }

      setServices(list);
    } catch (err) {
      console.error("Service fetch error", err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchServices();
    if (isEdit) fetchConfirmation();
  }, [id]);

  /* ================= ITEM HANDLERS ================= */
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { item: "", nop: "", weight: "", service_id: "" }],
    });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;
    setForm({ ...form, items });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.client_id) {
      alert("Select client");
      return;
    }

    if (!form.items.some((i) => i.item && i.service_id)) {
      alert("Add at least one item");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/admin/job-confirmation/${id}`, form);
        alert("Job updated successfully ✅");
      } else {
        const res = await api.post("/admin/job-confirmation", form);
        alert(`Job Created: ${res.data.confirmationid}`);
      }

      navigate("/confirmation-list");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading…</p>;
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Job Confirmation" : "Job Confirmation"}
      </h1>

      {/* CLIENT */}
      <Card>
        <Grid>
          <Field label="Client Name">
            <select
              className="input"
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            >
              <option value="">- Select Client -</option>

              {Array.isArray(clients) &&
                clients.map((c) => (
                  <option key={c.client_id} value={c.client_id}>
                    {c.client_name}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="Client Banner Logo">
            <select
              className="input"
              value={form.company_logo}
              onChange={(e) =>
                setForm({ ...form, company_logo: e.target.value })
              }
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </Field>
        </Grid>
      </Card>

      {/* ITEMS */}
      <Card title="Items Details">
        <div className="flex justify-end mb-4">
          <button
            onClick={addItem}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Item
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Pieces</th>
              <th>Weight</th>
              <th>Service ID</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <select
                    className="input"
                    value={row.item}
                    onChange={(e) => updateItem(i, "item", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Jewellery</option>
                    <option>Loose diamond</option>
                    <option>Gem Stone</option>
                    <option>CVD</option>
                  </select>
                </td>
                <td>
                  <input
                    className="input"
                    value={row.nop}
                    onChange={(e) => updateItem(i, "nop", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.weight}
                    onChange={(e) => updateItem(i, "weight", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="input"
                    value={row.service_id}
                    onChange={(e) =>
                      updateItem(i, "service_id", e.target.value)
                    }
                  >
                    <option value="">- Select Service -</option>

                    {loadingServices && (
                      <option disabled>Loading services...</option>
                    )}

                    {!loadingServices &&
                      Array.isArray(services) &&
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
      </Card>

      {/* DELIVERY */}
      <Card>
        <Grid>
          <Field label="Depositor Name">
            <input
              className="input"
              value={form.depositor_name}
              onChange={(e) =>
                setForm({ ...form, depositor_name: e.target.value })
              }
            />
          </Field>

          <Field label="Receiver Name">
            <input
              className="input"
              value={form.receiver_name}
              onChange={(e) =>
                setForm({ ...form, receiver_name: e.target.value })
              }
            />
          </Field>

          <Field label="Invoice Date">
            <input
              type="date"
              className="input"
              value={form.invoice_date}
              onChange={(e) =>
                setForm({ ...form, invoice_date: e.target.value })
              }
            />
          </Field>

          <Field label="Delivery Date">
            <input
              type="date"
              className="input"
              value={form.delivery_date}
              onChange={(e) =>
                setForm({ ...form, delivery_date: e.target.value })
              }
            />
          </Field>
        </Grid>
      </Card>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          {isEdit ? "Update Job" : "Submit Job"}
        </button>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */
function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
