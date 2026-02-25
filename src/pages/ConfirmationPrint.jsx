import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";

import api from "../api/axios";

export default function ConfirmationPrint() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { id } = useParams();
  const printRef = useRef();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = () => window.print();

  useEffect(() => {
    const fetchPrintData = async () => {
      try {
        const res = await api.get(`/admin/job-confirmation-print/${id}`);
        setData(res.data.data);
      } catch (err) {
        setError(true); // 👈 IMPORTANT
      } finally {
        setLoading(false);
      }
    };

    fetchPrintData();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Loading print…</p>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Confirmation Not Found
          </h2>

          <p className="text-gray-600">
            The confirmation number you entered is invalid or deleted.
          </p>

          <button
            onClick={() => navigate("/confirmation-list")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            ⬅ Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* ACTION BAR */}
      <div className="flex justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Print
        </button>
      </div>

      {/* PRINT AREA */}
      <div
        ref={printRef}
        className="bg-white mx-auto p-8 shadow print:shadow-none print:p-6 max-w-[210mm]"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <img src="/logo/gemtech-logo.webp" alt="GIL" className="h-16" />
          <h1 className="text-xl font-bold tracking-wide">CONFIRMATION</h1>
        </div>

        {/* META */}
        <div className="grid grid-cols-2 text-sm mb-4">
          <div>
            <p>
              <strong>Confirmation No :</strong> {data.confirmationid}
            </p>
            <p>
              <strong>Received By :</strong> {data.received_by}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Print Date :</strong> {data.print_date}
            </p>
            <p>
              <strong>Received On :</strong> {data.received_on}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full border text-sm mb-4">
          <thead>
            <tr>
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Retailer</th>
              <th className="border p-2">Supplier</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">No of Pcs</th>
              <th className="border p-2">Weight</th>
              <th className="border p-2">Services</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{data.client.name}</td>
                <td className="border p-2">{data.client.supplier || "---"}</td>
                <td className="border p-2">{row.item}</td>
                <td className="border p-2 text-center">{row.nop}</td>
                <td className="border p-2 text-center">{row.weight}</td>
                <td className="border p-2">{row.service}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <p className="text-sm">
          <strong>Total No. of Pieces :</strong> {data.total_pieces}
        </p>

        {/* TERMS */}
        <div className="text-xs mt-6">
          <p className="font-semibold">Terms and Conditions :</p>
          <p>
            GIL shall not be responsible for damage or loss unless caused by
            staff.
          </p>
          <p>We agree to the laboratory examination and certification terms.</p>
        </div>

        {/* SIGNATURES */}
        <div className="flex justify-between text-sm mt-16">
          <div>
            <p>Receiver's Signature</p>
            <p className="mt-8">Date</p>
          </div>
          <div className="text-right">
            <p>Depositor's Signature</p>
            <p className="mt-8">Deposited By</p>
          </div>
        </div>
      </div>
    </div>
  );
}
