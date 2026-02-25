import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import BigCertificate from "./BigCertificate";
import { QRCodeCanvas } from "qrcode.react";



/* =====================================================
   CERTIFICATE CARD
   SIZE: 90mm x 55mm
===================================================== */

// function CertificateCard({ data }) {
//   return (
//     <div
//       className="
//         certificate-card
//         w-[90mm] h-[55mm]
//         border border-gray-400
//         bg-white
//         p-3
//         text-[11px]
//         font-serif
//         leading-tight
//         overflow-hidden
//       "
//     >
//       {/* HEADER */}
//       <div className="flex items-center gap-3 mb-2 border-b pb-1">
//         <img
//           src="/logo/GIL.jpg"
//           alt="Logo"
//           className="h-12 w-[15rem] object-contain"
//         />
       
//       </div>

//       {/* SUMMARY */}
//       <div className="flex gap-2 mb-1">
//         <span className="font-semibold">SUMMARY NO</span>
//         <span>: {data.summary_no}</span>
//       </div>

//       {/* DESCRIPTION */}
//       <p className="text-[10px] mb-2 line-clamp-2">
//         <span className="font-semibold">DESCRIPTION</span> :
//         {data.description}
//       </p>

//       {/* BODY */}
//       <div className="flex justify-between gap-2">
//         {/* DETAILS */}
//         <div className="space-y-[2px] w-[65%]">
//           <p><b>SHAPE / CUT</b> : {data.shape_cut}</p>
//           <p><b>TOTAL EST.WT</b> : {data.total_estwt}</p>
//           <p><b>MIN. COLOUR</b> : {data.min_colour}</p>
//           <p><b>MIN. CLARITY</b> : {data.min_clarity}</p>
//         </div>

//         {/* IMAGE */}
//         <div
//           className="
//             w-[22mm] h-[22mm]
//             border border-gray-400
//             flex items-center justify-center
//           "
//         >
//           {data.image_url ? (
//             <img
//               src={data.image_url}
//               alt="Stone"
//               className="max-w-full max-h-full object-contain"
//             />
//           ) : (
//             <span className="text-[8px] text-gray-400">No Image</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

function CertificateCard({ data }) {
  return (
    <div
      className="
        certificate-card
        w-[170mm] h-[95mm]
        border border-gray-300
        bg-white
        p-4
        text-[11px]
        font-sans
        leading-tight
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between border-b pb-2 mb-3">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img
            src="/logo/GIL.jpg"
            alt="GIL Logo"
            className="h-10 object-contain"
          />
          <div>
            <p className="font-semibold text-[12px] uppercase">
              Gemtech International Laboratories
            </p>
            <p className="text-[10px] uppercase text-gray-600">
              Jewellery Report
            </p>
          </div>
        </div>

        {/* QR */}
        <QRCodeCanvas
        value={`https://gil-labs.com/certificate/verify/${data.summary_no}`}
        size={50}
        level="H"
      />
      </div>

      {/* ================= BODY ================= */}
      <div className="grid grid-cols-12 gap-3">
        {/* LEFT TEXT */}
        <div className="col-span-8 space-y-1">
          <Row label="SUMMARY NO" value={data.summary_no} />
          <Row label="DESCRIPTION" value={data.description} />
          <Row label="SHAPE / CUT" value={data.shape_cut} />
          <Row label="TOTAL EST. WT" value={data.total_estwt} />
          <Row label="MIN. COLOUR" value={data.min_colour} />
          <Row label="MIN. CLARITY" value={data.min_clarity} />
          <Row
            label="COMMENTS"
            value={data.comments || "Grading and Analysis as mounting permits"}
          />
        </div>

        {/* RIGHT IMAGE */}
        <div className="col-span-4 flex flex-col items-center justify-center">
          <div className="border border-gray-400 w-[55mm] h-[35mm] flex items-center justify-center">
            {data.image_url ? (
              <img
                src={data.image_url}
                alt="Jewellery"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-[9px] text-gray-400">No Image</span>
            )}
          </div>
          <p className="text-[9px] text-gray-500 mt-1">Approved Photo</p>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex gap-2">
    <span className="w-[110px] font-semibold">{label}</span>
    <span>:</span>
    <span className="flex-1">{value}</span>
  </div>
);

/* =====================================================
   CERTIFICATE PREVIEW + PRINT
===================================================== */

export default function CertificatePreview() {
  const { state } = useLocation();
  const jobcardIds = state?.jobcard_ids || [];



const requestBig = state?.big_jewellery === true; //
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!jobcardIds.length) return;

  setLoading(true);

  api
    .post("/admin/certificates/print", {
      jobcard_ids: jobcardIds,
    })
    .then((res) => {
      const allCerts = res.data?.certificates || [];

      // 🧠 RULE:
      // Small certificate → always allowed
      // Big certificate → only if big_jewellery = 1

      if (requestBig) {
        const bigCerts = allCerts.filter(
          (c) => Number(c.big_jewellery) === 1
        );

        if (!bigCerts.length) {
          alert("No Big Jewellery Certificates available.");
          setCertificates([]);
          return;
        }

        setCertificates(bigCerts);
      } else {
        // ✅ SMALL CERTIFICATE → TAKE EVERYTHING
        setCertificates(allCerts);
      }
    })
    .catch((error) => {
      console.error("API ERROR:", error);
      alert("Failed to load certificates.");
    })
    .finally(() => {
      setLoading(false);
    });
}, [jobcardIds, requestBig]);




  if (!jobcardIds.length) {
    return <p className="p-6 text-red-500">No certificates selected</p>;
  }

  // if (loading) {
  //   return <p className="p-6">Loading certificates...</p>;
  // }

 if (!loading && certificates.length === 0) {
  return (
    <p className="p-6 text-center text-red-600 font-semibold">
      No certificates available for selected option
    </p>
  );
}


  return (
    <>
      {/* SCREEN VIEW */}
      <div className="min-h-screen w-full bg-gray-100 p-6">
        {/* <div
          id="print-area"
          className="flex flex-wrap gap-4"
        >
          {certificates.map((c, i) => (
            <CertificateCard key={i} data={c} />
          ))}
        </div> */}

      <div id="print-area" className="flex flex-col gap-10">
  {certificates.map((c, i) =>
    requestBig ? (
      <BigCertificate key={i} data={c} />
    ) : (
      <CertificateCard key={i} data={c} />
    )
  )}
</div>



        {/* PRINT BUTTON */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Print Certificates
          </button>
        </div>
      </div>

      {/* ================= PRINT STYLES ================= */}
      <style>
        {`
        @media print {

          /* A4 page setup */
          @page {
            size: A4;
            margin: 6mm;
          }

          /* Hide everything */
          body * {
            visibility: hidden;
          }

          /* Show only cards */
          #print-area,
          #print-area * {
            visibility: visible;
          }

          /* Force cards to top-left */
          #print-area {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 6mm;
          }

          /* Prevent split */
          .certificate-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Hide button */
          .print\\:hidden {
            display: none !important;
          }
        }
        `}
      </style>
    </>
  );
}
