import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AddClient() {
  /* ================= CLIENT FORM ================= */
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

  const [loadingPin, setLoadingPin] = useState(false);

  /* ================= SERVICES ================= */
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Default depositor / retailer / supplier
      if (name === "clientName") {
        updated.depositorName = value;
        updated.retailer = value;
        updated.supplier = value;
      }

      return updated;
    });
  };

  /* ================= PINCODE SEARCH ================= */
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
      } else {
        alert("Invalid Pincode");
      }
    } catch {
      alert("Failed to fetch pincode");
    } finally {
      setLoadingPin(false);
    }
  };

  /* ================= FETCH SERVICES ================= */
  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get("/admin/service-with-rate");

      const mapped = res.data.data.map((s) => ({
        service_id: s.id,
        service_name: s.name,
        rates: s.rate_cards.map((r) => ({
          carat:
            r.carat_from && r.carat_to ? `${r.carat_from} - ${r.carat_to}` : "",
          rate: r.rate || "",
          unit: r.unit || "p/pc",
        })),
      }));

      setServices(mapped);
    } catch (err) {
      alert("Service fetch failed");
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* ================= VALIDATION ================= */
  const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
  const isValidPincode = (pin) => /^\d{6}$/.test(pin);

  /* ================= SAVE CLIENT ================= */
  const handleSaveClient = async () => {
    if (
      !form.clientName ||
      !form.mobile ||
      !form.email ||
      !form.address ||
      !form.pincode
    ) {
      alert("Please fill all mandatory fields");
      return;
    }

    if (!isValidMobile(form.mobile)) {
      alert("Mobile must be 10 digits and start with 6/7/8/9");
      return;
    }

    if (!isValidPincode(form.pincode)) {
      alert("Pincode must be 6 digits");
      return;
    }

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

      services: services,
    };

    try {
      await api.post("/admin/clients", payload);
      alert("Client saved successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Client</h1>
        <button
          onClick={handleSaveClient}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Save Client
        </button>
      </div>

      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Grid>
          <Input
            label="Client Name *"
            name="clientName"
            onChange={handleChange}
          />
          <Input label="Mobile *" name="mobile" onChange={handleChange} />
          <Input label="Email *" name="email" onChange={handleChange} />
          <Textarea
            label="Address *"
            name="address"
            onChange={handleChange}
            span
          />
        </Grid>
      </Section>

      {/* LOCATION */}
      <Section title="Location Details">
        <Grid cols={3}>
          <Input
            label="Pincode *"
            name="pincode"
            onChange={(e) => {
              handleChange(e);
              handlePincode(e.target.value);
            }}
          />
          <Input label="Country" value={form.country} readOnly />
          <Input label="State" value={form.state} readOnly />
          <Input label="City" value={form.city} readOnly />
        </Grid>
        {loadingPin && (
          <p className="text-sm text-gray-500">Fetching location…</p>
        )}
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
          <Input label="PAN" name="pan" onChange={handleChange} />
          <Input label="TAN" name="tan" onChange={handleChange} />
          <Input label="GSTIN" name="gstin" onChange={handleChange} span />
        </Grid>
      </Section>

      {/* SERVICES */}
      <Section title="Service Pricing">
        {loadingServices ? (
          <p>Loading services…</p>
        ) : (
          services.map((s, si) => (
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
                    type="number"
                    value={r.rate}
                    onChange={(e) => {
                      const temp = [...services];
                      temp[si].rates[ri].rate = e.target.value;
                      setServices(temp);
                    }}
                    className="input"
                  />
                  <input
                    value={r.unit}
                    disabled
                    className="input bg-gray-100"
                  />
                </div>
              ))}
            </div>
          ))
        )}
      </Section>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

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

function Input({ label, name, onChange, value, readOnly, span }) {
  return (
    <div className={span ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className={`input ${readOnly ? "bg-gray-100" : ""}`}
      />
    </div>
  );
}

function Textarea({ label, name, onChange, span }) {
  return (
    <div className={span ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea name={name} rows="3" onChange={onChange} className="input" />
    </div>
  );
}
