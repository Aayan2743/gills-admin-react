import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

/* =====================================================
   GEMSTONE SMALL CARD (90mm x 55mm)
===================================================== */

function GemstoneCard({ data }) {
  return (
    <div
      className="
        certificate-card
        w-[90mm] h-[55mm]
        border border-gray-400
        bg-white
        p-3
        text-[10px]
        font-sans
        leading-tight
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-1 mb-2">
        <div className="flex items-center gap-2">
          <img src="/logo/GIL.jpg" alt="Logo" className="h-6 object-contain" />
          <div className="leading-tight">
            <p className="text-[9px] font-semibold uppercase">
              Gemtech International Laboratories
            </p>
            <p className="text-[8px] uppercase text-gray-500">
              Gemstone Report
            </p>
          </div>
        </div>

        <QRCodeCanvas
          value={`https://gil-labs.com/verify/${data.summary_no}`}
          size={35}
        />
      </div>

      {/* BODY */}
      <div className="flex gap-2">
        {/* LEFT DETAILS */}
        <div className="w-[65%] space-y-[2px]">
          <Row label="SUMMARY NO" value={data.summary_no} />
          <Row label="SPECIES" value={data.species} />
          <Row label="VARIETY" value={data.variety} />
          <Row label="SHAPE & CUT" value={data.shape_cut} />
          <Row label="CARAT WT" value={data.carat_weight} />
          <Row label="MEASURE" value={data.measurements} />
          <Row label="TRANSP." value={data.transparency} />
          <Row label="RI" value={data.refindex} />
          <Row label="COMMENTS" value={data.comments} />
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-[35%] flex flex-col items-center justify-center">
          <div className="border border-gray-400 w-[20mm] h-[20mm] flex items-center justify-center">
            {data.image_url ? (
              <img
                src={data.image_url}
                alt="Gem"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-[8px] text-gray-400">No Image</span>
            )}
          </div>
          <p className="text-[8px] text-gray-400 mt-1">Approx Photo</p>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex gap-1">
    <span className="w-[60px] font-semibold text-[8px]">{label}</span>
    <span className="text-[8px]">:</span>
    <span className="text-[8px] truncate">{value}</span>
  </div>
);

/* =====================================================
   PREVIEW + PRINT COMPONENT
===================================================== */

export default function GemstoneCertificatePreview() {
  const { state } = useLocation();
  const jobcardIds = state?.jobcard_ids || [];

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobcardIds.length) return;

    setLoading(true);

    api
      .post("/admin/gemstone/certificates/print", {
        jobcard_ids: jobcardIds,
      })
      .then((res) => {
        setCertificates(res.data?.certificates || []);
      })
      .catch(() => {
        alert("Failed to load certificates");
      })
      .finally(() => setLoading(false));
  }, [jobcardIds]);

  if (!jobcardIds.length) {
    return <p className="p-6 text-red-500">No certificates selected</p>;
  }

  if (loading) {
    return <p className="p-6">Loading certificates...</p>;
  }

  if (!certificates.length) {
    return <p className="p-6 text-red-600">No certificates available</p>;
  }

  return (
    <>
      {/* SCREEN VIEW */}
      <div className="min-h-screen bg-gray-100 p-6">
        <div id="print-area" className="flex flex-wrap gap-[5mm]">
          {certificates.map((c, i) => (
            <GemstoneCard key={i} data={c} />
          ))}
        </div>

        {/* PRINT BUTTON */}
        <div className="text-center mt-8 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Print Certificates
          </button>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>
        {`
          @media print {

            @page {
              size: A4;
              margin: 6mm;
            }

            body * {
              visibility: hidden;
            }

            #print-area,
            #print-area * {
              visibility: visible;
            }

            #print-area {
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              flex-wrap: wrap;
              gap: 5mm;
            }

            .certificate-card {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .print\\:hidden {
              display: none !important;
            }
          }
        `}
      </style>
    </>
  );
}
