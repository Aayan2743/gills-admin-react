import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    clientName: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    district: "",
    depositorName: "",
    retailer: "",
    supplier: "",
    pan: "",
    tan: "",
    gstin: "",
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPin, setLoadingPin] = useState(false);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= PINCODE ================= */
  const handlePincode = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      setLoadingPin(true);
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const po = data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          country: po.Country,
          state: po.State,
          city: po.District,
          district: po.District,
        }));
      }
    } finally {
      setLoadingPin(false);
    }
  };

  /* ================= LOAD CLIENT ================= */
  const fetchClient = async () => {
    try {
      const res = await api.get(`/admin/clients/${id}`);
      const c = res.data.data;

      setForm({
        clientName: c.client_name,
        mobile: c.phonenumber,
        email: c.email,
        address: c.address,
        pincode: c.pincode,
        country: c.country,
        state: c.state,
        city: c.city,
        district: c.district,
        depositorName: c.depositorname,
        retailer: c.retailer,
        supplier: c.supplier,
        pan: c.panno,
        tan: c.tanno,
        gstin: c.gstno,
      });

      setServices(c.services || []);
    } catch {
      alert("Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  /* ================= UPDATE ================= */
  const handleUpdateClient = async () => {
    const payload = {
      client_name: form.clientName,
      phonenumber: form.mobile,
      email: form.email,
      address: form.address,
      pincode: form.pincode,
      country: form.country,
      state: form.state,
      city: form.city,
      district: form.district,
      depositorname: form.depositorName,
      retailer: form.retailer,
      supplier: form.supplier,
      panno: form.pan,
      tanno: form.tan,
      gstno: form.gstin,
      services,
    };

    try {
      await api.put(`/admin/clients/${id}`, payload);
      alert("Client updated successfully ✅");
      navigate("/view-client");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center py-10">Loading client…</p>;

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Client</h1>
        <button
          onClick={handleUpdateClient}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Update Client
        </button>
      </div>

      {/* BASIC */}
      <Section title="Basic Information">
        <Grid>
          <Input
            label="Client Name"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
          />
          <Input
            label="Mobile"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Textarea
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            span
          />
        </Grid>
      </Section>

      {/* LOCATION */}
      <Section title="Location Details">
        <Grid cols={3}>
          <Input
            label="Pincode"
            name="pincode"
            value={form.pincode}
            onChange={(e) => {
              handleChange(e);
              handlePincode(e.target.value);
            }}
          />
          <Input label="Country" value={form.country} readOnly />
          <Input label="State" value={form.state} readOnly />
          <Input label="City" value={form.city} readOnly />
        </Grid>
        {loadingPin && <p className="text-sm">Fetching location…</p>}
      </Section>

      {/* BUSINESS */}
      <Section title="Business Details">
        <Grid>
          <Input
            label="Depositor Name"
            name="depositorName"
            value={form.depositorName}
            onChange={handleChange}
          />
          <Input
            label="Retailer"
            name="retailer"
            value={form.retailer}
            onChange={handleChange}
          />
          <Input
            label="Supplier"
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
          />
          <Input
            label="PAN"
            name="pan"
            value={form.pan}
            onChange={handleChange}
          />
          <Input
            label="TAN"
            name="tan"
            value={form.tan}
            onChange={handleChange}
          />
          <Input
            label="GSTIN"
            name="gstin"
            value={form.gstin}
            onChange={handleChange}
            span
          />
        </Grid>
      </Section>

      {/* SERVICES */}
      <Section title="Service Pricing">
        {services.map((s, si) => (
          <div key={s.service_id} className="mb-6">
            <h3 className="font-semibold mb-2">{s.service_name}</h3>

            {s.rates.map((r, ri) => (
              <div key={ri} className="grid grid-cols-3 gap-3 mb-2">
                <input
                  value={r.carat}
                  onChange={(e) => {
                    const temp = [...services];
                    temp[si].rates[ri].carat = e.target.value;
                    setServices(temp);
                  }}
                  className="input"
                />
                <input
                  value={r.rate}
                  onChange={(e) => {
                    const temp = [...services];
                    temp[si].rates[ri].rate = e.target.value;
                    setServices(temp);
                  }}
                  className="input"
                />
                <input value={r.unit} disabled className="input bg-gray-100" />
              </div>
            ))}
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ================= UI HELPERS ================= */
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ cols = 2, children }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea {...props} rows="3" className="input" />
    </div>
  );
}
