

import { useEffect, useState } from "react";
import api from "../api/axios";
import RateCardForm from "./RateCardForm";

export default function RateCard() {
  const [services, setServices] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // 🔹 FETCH SERVICES WITH RATE CARDS
  const fetchServices = async () => {
    try {
      const res = await api.get("/admin/service-with-rate");
      setServices(res.data.data);
    } catch (err) {
      console.error("Failed to load rate cards", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = (serviceId) => {
    setEditData({ service_id: serviceId });
    setOpenForm(true);
  };

  const handleEdit = (rate) => {
    setEditData(rate);
    setOpenForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await api.put(`/admin/rate-cards/${formData.id}`, formData);
      } else {
        await api.post("/admin/rate-cards", formData);
      }

      setOpenForm(false);
      fetchServices();
    } catch (err) {
      if (err.response?.status === 422) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Rate Card</h1>

      {services.map((service) => (
        <div key={service.id} className="bg-white shadow rounded">
          {/* HEADER */}
          <div className="flex justify-between items-center bg-[#b08a5a] text-white px-4 py-2">
            <span className="font-semibold">{service.name}</span>
            <button
              onClick={() => handleAdd(service.id)}
              className="bg-white text-[#b08a5a] px-3 py-1 rounded text-sm font-medium"
            >
              ➕ Add
            </button>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Carat Wt</th>
                <th className="p-3 text-left">Rate (₹)</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {service.rate_cards.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                service.rate_cards.map((rate) => (
                  <tr key={rate.id} className="border-t">
                    <td className="p-3">
                      {rate.carat_to
                        ? `${rate.carat_from} - ${rate.carat_to}`
                        : `${rate.carat_from} - Above`}
                    </td>
                    <td className="p-3">{rate.rate}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(rate)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}

      {openForm && (
        <RateCardForm
          data={editData}
          onClose={() => setOpenForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
