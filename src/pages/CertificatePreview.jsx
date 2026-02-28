// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { useLocation } from "react-router-dom";
// import BigCertificate from "./BigCertificate";
// import { QRCodeCanvas } from "qrcode.react";

// function CertificateCard({ data }) {
//   return (
//     <div
//       className="
//         certificate-card
//         w-[90mm] h-[55mm]
//         border border-gray-400
//         bg-white
//         p-2
//         text-[9px]
//         font-sans
//         leading-tight
//         overflow-hidden
//       "
//     >
//       {/* ===== HEADER ===== */}
//       <div className="flex justify-between items-center border-b pb-1 mb-1">
//         <div className="flex items-center gap-1">
//           <img src="/logo/GIL.jpg" alt="Logo" className="h-6 object-contain" />
//           <div className="leading-tight">
//             <p className="text-[8px] font-semibold uppercase">
//               Gemtech International Laboratories
//             </p>
//             <p className="text-[7px] uppercase text-gray-500">
//               Jewellery Report
//             </p>
//           </div>
//         </div>

//         <QRCodeCanvas
//           value={`https://gil-labs.com/certificate/verify/${data.summary_no}`}
//           size={30}
//           level="H"
//         />
//       </div>

//       {/* ===== BODY ===== */}
//       <div className="flex gap-2">
//         {/* LEFT DETAILS */}
//         <div className="w-[65%] space-y-[2px]">
//           <SmallRow label="SUMMARY" value={data.summary_no} />
//           <SmallRow label="DESC" value={data.description} />
//           <SmallRow label="SHAPE" value={data.shape_cut} />
//           <SmallRow label="EST WT" value={data.total_estwt} />
//           <SmallRow label="COLOUR" value={data.min_colour} />
//           <SmallRow label="CLARITY" value={data.min_clarity} />
//           <SmallRow
//             label="COMMENTS"
//             value={data.comments || "Grading and Analysis as mounting permits"}
//           />
//         </div>

//         {/* RIGHT IMAGE */}
//         <div className="w-[35%] flex flex-col items-center justify-center">
//           <div className="border border-gray-400 w-[20mm] h-[20mm] flex items-center justify-center">
//             {data.image_url ? (
//               <img
//                 src={data.image_url}
//                 alt="Jewellery"
//                 className="max-w-full max-h-full object-contain"
//               />
//             ) : (
//               <span className="text-[7px] text-gray-400">No Image</span>
//             )}
//           </div>
//           <p className="text-[7px] text-gray-400 mt-1">Approved Photo</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const SmallRow = ({ label, value }) => (
//   <div className="flex gap-1">
//     <span className="w-[50px] font-semibold text-[8px]">{label}</span>
//     <span className="text-[8px]">:</span>
//     <span className="text-[8px] truncate">{value}</span>
//   </div>
// );

// const Row = ({ label, value }) => (
//   <div className="flex gap-2">
//     <span className="w-[110px] font-semibold">{label}</span>
//     <span>:</span>
//     <span className="flex-1">{value}</span>
//   </div>
// );

// /* =====================================================
//    CERTIFICATE PREVIEW + PRINT
// ===================================================== */

// export default function CertificatePreview() {
//   const { state } = useLocation();
//   const jobcardIds = state?.jobcard_ids || [];

//   const requestBig = state?.big_jewellery === true; //
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!jobcardIds.length) return;

//     setLoading(true);

//     api
//       .post("/admin/certificates/print", {
//         jobcard_ids: jobcardIds,
//       })
//       .then((res) => {
//         const allCerts = res.data?.certificates || [];

//         // 🧠 RULE:
//         // Small certificate → always allowed
//         // Big certificate → only if big_jewellery = 1

//         if (requestBig) {
//           const bigCerts = allCerts.filter(
//             (c) => Number(c.big_jewellery) === 1,
//           );

//           if (!bigCerts.length) {
//             alert("No Big Jewellery Certificates available.");
//             setCertificates([]);
//             return;
//           }

//           setCertificates(bigCerts);
//         } else {
//           // ✅ SMALL CERTIFICATE → TAKE EVERYTHING
//           setCertificates(allCerts);
//         }
//       })
//       .catch((error) => {
//         console.error("API ERROR:", error);
//         alert("Failed to load certificates.");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [jobcardIds, requestBig]);

//   if (!jobcardIds.length) {
//     return <p className="p-6 text-red-500">No certificates selected</p>;
//   }

//   // if (loading) {
//   //   return <p className="p-6">Loading certificates...</p>;
//   // }

//   if (!loading && certificates.length === 0) {
//     return (
//       <p className="p-6 text-center text-red-600 font-semibold">
//         No certificates available for selected option
//       </p>
//     );
//   }

//   return (
//     <>
//       {/* SCREEN VIEW */}
//       <div className="min-h-screen w-full bg-gray-100 p-6">
//         {/* <div
//           id="print-area"
//           className="flex flex-wrap gap-4"
//         >
//           {certificates.map((c, i) => (
//             <CertificateCard key={i} data={c} />
//           ))}
//         </div> */}

//         <div id="print-area" className="flex flex-col gap-10">
//           {certificates.map((c, i) =>
//             requestBig ? (
//               <BigCertificate key={i} data={c} />
//             ) : (
//               <CertificateCard key={i} data={c} />
//             ),
//           )}
//         </div>

//         {/* PRINT BUTTON */}
//         <div className="mt-8 text-center print:hidden">
//           <button
//             onClick={() => window.print()}
//             className="bg-black text-white px-6 py-2 rounded"
//           >
//             Print Certificates
//           </button>
//         </div>
//       </div>

//       {/* ================= PRINT STYLES ================= */}
//       <style>
//         {`
//         @media print {

//           /* A4 page setup */
//           @page {
//             size: A4;
//             margin: 6mm;
//           }

//           /* Hide everything */
//           body * {
//             visibility: hidden;
//           }

//           /* Show only cards */
//           #print-area,
//           #print-area * {
//             visibility: visible;
//           }

//           /* Force cards to top-left */
//           #print-area {
//             position: absolute;
//             top: 0;
//             left: 0;
//             display: flex;
//             flex-wrap: wrap;
//             gap: 6mm;
//           }

//           /* Prevent split */
//           .certificate-card {
//             page-break-inside: avoid;
//             break-inside: avoid;
//           }

//           /* Hide button */
//           .print\\:hidden {
//             display: none !important;
//           }
//         }
//         `}
//       </style>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import BigCertificate from "./BigCertificate";
import { QRCodeCanvas } from "qrcode.react";

function CertificateCard({ data }) {
  return (
    <div
      className="
        certificate-card
        w-[90mm] h-[55mm]
        border border-gray-400
        bg-white
        p-2
        text-[9px]
        font-sans
        leading-tight
        overflow-hidden
      "
    >
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center border-b pb-1 mb-1">
        <div className="flex items-center gap-1">
          <img src="/logo/GIL.jpg" alt="Logo" className="h-6 object-contain" />
          <div className="leading-tight">
            <p className="text-[8px] font-semibold uppercase">
              Gemtech International Laboratories
            </p>
            <p className="text-[7px] uppercase text-gray-500">
              Jewellery Report
            </p>
          </div>
        </div>

        <QRCodeCanvas
          value={`https://gil-labs.com/certificate/verify/${data.summary_no}`}
          size={30}
          level="H"
        />
      </div>

      {/* ===== BODY ===== */}
      <div className="flex gap-2">
        {/* LEFT DETAILS */}
        <div className="w-[65%] space-y-[2px]">
          <SmallRow label="SUMMARY" value={data.summary_no} />
          <SmallRow label="DESC" value={data.description} />
          <SmallRow label="SHAPE" value={data.shape_cut} />
          <SmallRow label="EST WT" value={data.total_estwt} />
          <SmallRow label="COLOUR" value={data.min_colour} />
          <SmallRow label="CLARITY" value={data.min_clarity} />
          <SmallRow
            label="COMMENTS"
            value={data.comments || "Grading and Analysis as mounting permits"}
          />
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-[35%] flex flex-col items-center justify-center">
          <div className="border border-gray-400 w-[20mm] h-[20mm] flex items-center justify-center">
            {data.image_url ? (
              <img
                src={data.image_url}
                alt="Jewellery"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-[7px] text-gray-400">No Image</span>
            )}
          </div>
          <p className="text-[7px] text-gray-400 mt-1">Approved Photo</p>
        </div>
      </div>
    </div>
  );
}

const SmallRow = ({ label, value }) => (
  <div className="flex gap-1">
    <span className="w-[50px] font-semibold text-[8px]">{label}</span>
    <span className="text-[8px]">:</span>
    <span className="text-[8px] truncate">{value}</span>
  </div>
);

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
            (c) => Number(c.big_jewellery) === 1,
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
            ),
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
