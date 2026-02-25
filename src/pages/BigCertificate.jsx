// import React from "react";
// import { Facebook, Instagram, Twitter } from "lucide-react";
// export default function BigCertificate() {


//   const data = {
//     certificateNo: "GILHJ20071",
//     product: "Diamond Necklace",
//     grossWt: "147.92 grams",
//     shapeCut: "Round Brilliant",
//     totalEstWt: "± 14.09 Carat / 10 Dia pcs",
//     minColour: "E - F",
//     minClarity: "VVS1 - VVS2",
//     image: "http://gil-labs.com/gil_images/2015531533ring.png",
//   };

//   return (
//     <div className="w-screen min-h-screen bg-gray-200 flex justify-center py-10">
//       <div
//         id="print-area"
//         className="bg-white w-[260mm] min-h-[297mm] px-8 py-6 text-[11px] font-sans"
//       >
//         <div className="grid grid-cols-12 gap-x-10 gap-y-10">

//           {/* ================= LEFT ================= */}
//           <div className="col-span-4 flex flex-col gap-8">

//             <Section title="Color Grading Scale">
//               <ScaleRow
//                 labels={["D","E","F","G","H","I","J","K","L","M","N-O","P-R","S-Z"]}
//                 selected={["E","F"]}
//               />
//             </Section>

//             <Section title="Clarity Grading Scale">
//               <ScaleRow
//                 labels={["IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3"]}
//                 selected={["VVS1","VVS2"]}
//               />
//               <ScaleRow
//                 labels={["IF","VVS","VS","SI","I"]}
//                 selected={["VVS"]}
//                 compact
//               />
//             </Section>

//             {/* LEFT FOOTER */}
//             <div className="bg-gray-100 border p-4 flex flex-col gap-4">
//               <div className="flex gap-4">
//                 <img
//                   src="/big-certificate/icons/cut/gil_globe.jpg"
//                   className="h-14"
//                   alt=""
//                 />
//                 <p className="text-[10px] leading-relaxed">
//                   To view this report online visit{" "}
//                   <b>www.gil-labs.com</b> and enter the certificate
//                   number exactly as it appears in the certificate search selection.
//                 </p>
//               </div>

//              <Social
//                 icon={Facebook}
//                 text="gemtechinternationallaboratories"
//                 />

//                 <Social
//                 icon={Instagram}
//                 text="GIL Laboratories"
//                 />

//                 <Social
//                 icon={Twitter}
//                 text="GIL Laboratories"
//                 />

//             </div>
//           </div>

//           {/* ================= CENTER ================= */}
//           <div className="col-span-4 flex flex-col items-center">

//             <img src="/logo/GIL.jpg" className="h-20 mb-2" alt="" />
//             <p className="uppercase text-[12px]">Certificate of Authenticity</p>
//             <p className="font-semibold mb-4">{data.certificateNo}</p>

//             <div className="bg-black rounded-xl p-6 mb-6 w-full flex justify-center">
//               <img src={data.image} className="rounded" alt="" />
//             </div>

//             <div className="bg-gray-100 border p-4 w-full">
//               <Section title="Product Information">
//                 <Info label="Product" value={data.product} />
//                 <Info label="Gross Wt" value={data.grossWt} />
//                 <Info label="Shape/Cut" value={data.shapeCut} />
//                 <Info label="Total Est.Dia.Wt" value={data.totalEstWt} />
//                 <Info label="MIN. Colour" value={data.minColour} />
//                 <Info label="MIN. Clarity" value={data.minClarity} />
//                 <Info
//                   label="Comments"
//                   value="Graded as mounting permits. For online certificate verification visit our website."
//                 />
//               </Section>
//             </div>
//           </div>

//           {/* ================= RIGHT ================= */}
//           <div className="col-span-4 flex flex-col gap-8">

//             <h4 className="font-semibold text-[13px]">The 4 C’s Diamonds</h4>

//            <FourC
//                 title="Cut"
//                 cols={6}
//                 items={[
//                    { label: "Round", image: "/big-certificate/icons/cut/ico_1.png" },
//                     { label: "Princess", image: "/big-certificate/icons/cut/ico_2.png" },
//                     { label: "Marquise", image: "/big-certificate/icons/cut/ico_3.png" },
//                     { label: "Pear", image: "/big-certificate/icons/cut/ico_4.png" },
//                     { label: "Heart", image: "/big-certificate/icons/cut/ico_5.png" },
//                     { label: "Oval", image: "/big-certificate/icons/cut/ico_6.png" },
//                 ]}
//                 />


//            <FourC
//                 title="Colour"
//                 cols={5}
//                 items={[
//                     { label: "D–F\nColourless", image: "/big-certificate/icons/cut/colour_ico1.png" },
//                     { label: "G–J\nNear Colourless", image: "/big-certificate/icons/cut/colour_ico2.png" },
//                     { label: "K–M\nSlightly Tinted", image: "/big-certificate/icons/cut/colour_ico3.png" },
//                     { label: "N–R\nVery Light Yellow", image: "/big-certificate/icons/cut/colour_ico4.png" },
//                     { label: "S–Z\nLight Yellow/Brown", image: "/big-certificate/icons/cut/colour_ico5.png" },
//                 ]}
//                 />


//           <FourC
//                 title="Clarity"
//                 cols={5}
//                 items={[
//                     { label: "IF", image: "/big-certificate/icons/cut/clarity_ico1.png" },
//                     { label: "VVS1–VVS2", image: "/big-certificate/icons/cut/clarity_ico2.png" },
//                     { label: "VS1–VS2", image: "/big-certificate/icons/cut/clarity_ico3.png" },
//                     { label: "SI1–SI2", image: "/big-certificate/icons/cut/clarity_ico4.png" },
//                     { label: "I1–I2–I3", image: "/big-certificate/icons/cut/clarity_ico4.png" },
//                 ]}
//                 />


//           <Section title="Carat">
//             <div className="flex justify-center">
//                 <img
//                 src="/big-certificate/icons/cut/carat_mm.png"
//                 alt="Carat size chart"
//                 className="w-full max-w-[520px] object-contain"
//                 />
//             </div>

//             <p className="text-right text-[10px] mt-2 text-gray-700">
//                 * Size not actual
//             </p>
//             </Section>


//           </div>
//         </div>
//       </div>

//       {/* PRINT FIX */}
//       <style>{`
//         @media print {
//           body * { visibility: hidden; }
//           #print-area, #print-area * { visibility: visible; }
//           #print-area {
//             position: absolute;
//             inset: 0;
//             width: 210mm;
//             min-height: 297mm;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ================= HELPERS ================= */

// const Section = ({ title, children }) => (
//   <div>
//     <div className="bg-gray-300 px-2 py-1 font-semibold text-[12px]">
//       {title}
//     </div>
//     <div className="mt-3">{children}</div>
//   </div>
// );

// const ScaleRow = ({ labels, selected = [], compact }) => (
//   <div className="relative mt-4">
//     <div className="absolute left-0 right-0 bottom-6 h-[1px] bg-gray-600"></div>
//     <div className="flex">
//       {labels.map((l) => (
//         <div key={l} className="flex-1 text-center relative">
//           <div className={`border-l border-gray-600 mx-auto ${compact ? "h-6" : "h-10"}`} />
//           {selected.includes(l) && (
//             <span className="absolute inset-0 flex items-center justify-center font-bold">x</span>
//           )}
//           <p className="text-[9px] mt-2">{l}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const FourC = ({ title, items, cols, yellow }) => {
//   const gridClass =
//     cols === 6 ? "grid-cols-6" : cols === 5 ? "grid-cols-5" : "grid-cols-3";

//   return (
//     <Section title={title}>
//       <div className={`grid ${gridClass} gap-6 text-center`}>
//         {items.map((item, index) => (
//           <div key={index} className="flex flex-col items-center">
//             <img
//               src={item.image}
//               alt={item.label}
//               className="h-14 w-14 object-contain rounded-full bg-white border"
//             />
//             <p className="text-[10px] whitespace-pre-line mt-1 text-center">
//               {item.label}
//             </p>
//           </div>
//         ))}
//       </div>
//     </Section>
//   );
// };


// const Info = ({ label, value }) => (
//   <div className="flex gap-2 mb-1">
//     <span className="w-[140px]">{label}</span>
//     <span>:</span>
//     <span>{value}</span>
//   </div>
// );

// const Social = ({ icon: Icon, text }) => (
//   <div className="flex items-center gap-3 text-[10px] text-gray-800">
//     <Icon className="h-5 w-5" strokeWidth={1.5} />
//     <span>{text}</span>
//   </div>
// );



import { Facebook, Instagram, Twitter } from "lucide-react";

export default function BigCertificate({ data }) {
  return (
    <div
      className="
        big-certificate
        bg-white
        w-[210mm]
        min-h-[297mm]
        px-8 py-6
        text-[11px]
        font-sans
        border
      "
    >
      <div className="grid grid-cols-12 gap-x-10 gap-y-10">

        {/* LEFT */}
        <div className="col-span-4 flex flex-col gap-8">
          <Section title="Color Grading Scale">
            <ScaleRow
              labels={["D","E","F","G","H","I","J","K","L","M","N-O","P-R","S-Z"]}
              selected={data.min_colour?.split(" - ") || []}
            />
          </Section>

          <Section title="Clarity Grading Scale">
            <ScaleRow
              labels={["IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2","I3"]}
              selected={data.min_clarity?.split(" - ") || []}
            />
          </Section>
        </div>

        {/* CENTER */}
        <div className="col-span-4 flex flex-col items-center">
          <img src="/logo/GIL.jpg" className="h-20 mb-2" />
          <p className="uppercase text-[12px]">Certificate of Authenticity</p>
          <p className="font-semibold mb-4">{data.summary_no}</p>

          <div className="bg-black rounded-xl p-6 mb-6 w-full flex justify-center">
            <img
              src={data.image_url}
              className="rounded max-h-[220px]"
            />
          </div>

          <div className="bg-gray-100 border p-4 w-full">
            <Section title="Product Information">
              <Info label="Description" value={data.description} />
              <Info label="Shape / Cut" value={data.shape_cut} />
              <Info label="Total Est. Wt" value={data.total_estwt} />
              <Info label="Min. Colour" value={data.min_colour} />
              <Info label="Min. Clarity" value={data.min_clarity} />
              <Info label="Comments" value={data.comments} />
            </Section>
          </div>
        </div>

        {/* RIGHT */}
      <div className="col-span-4 flex flex-col gap-8">
  <h4 className="font-semibold text-[13px]">
    The 4 C’s Diamonds
  </h4>

  {/* CUT */}
  <FourC
    title="Cut"
    cols={6}
    items={[
      { label: "Round", image: "/big-certificate/icons/cut/ico_1.png" },
      { label: "Princess", image: "/big-certificate/icons/cut/ico_2.png" },
      { label: "Marquise", image: "/big-certificate/icons/cut/ico_3.png" },
      { label: "Pear", image: "/big-certificate/icons/cut/ico_4.png" },
      { label: "Heart", image: "/big-certificate/icons/cut/ico_5.png" },
      { label: "Oval", image: "/big-certificate/icons/cut/ico_6.png" },
    ]}
  />

  {/* COLOUR */}
  <FourC
    title="Colour"
    cols={5}
    items={[
      {
        label: "D–F\nColourless",
        image: "/big-certificate/icons/cut/colour_ico1.png",
      },
      {
        label: "G–J\nNear Colourless",
        image: "/big-certificate/icons/cut/colour_ico2.png",
      },
      {
        label: "K–M\nSlightly Tinted",
        image: "/big-certificate/icons/cut/colour_ico3.png",
      },
      {
        label: "N–R\nVery Light Yellow",
        image: "/big-certificate/icons/cut/colour_ico4.png",
      },
      {
        label: "S–Z\nLight Yellow/Brown",
        image: "/big-certificate/icons/cut/colour_ico5.png",
      },
    ]}
  />

  {/* CLARITY */}
  <FourC
    title="Clarity"
    cols={5}
    items={[
      { label: "IF", image: "/big-certificate/icons/cut/clarity_ico1.png" },
      {
        label: "VVS1–VVS2",
        image: "/big-certificate/icons/cut/clarity_ico2.png",
      },
      {
        label: "VS1–VS2",
        image: "/big-certificate/icons/cut/clarity_ico3.png",
      },
      {
        label: "SI1–SI2",
        image: "/big-certificate/icons/cut/clarity_ico4.png",
      },
      {
        label: "I1–I2–I3",
        image: "/big-certificate/icons/cut/clarity_ico4.png",
      },
    ]}
  />

  {/* CARAT */}
  <Section title="Carat">
    <div className="flex justify-center">
      <img
        src="/big-certificate/icons/cut/carat_mm.png"
        alt="Carat size chart"
        className="w-full max-w-[520px] object-contain"
      />
    </div>

    <p className="text-right text-[10px] mt-2 text-gray-600">
      * Size not actual
    </p>
  </Section>
</div>

      </div>
    </div>
  );
}

/* ===== helpers (same as your earlier file) ===== */

const Section = ({ title, children }) => (
  <div>
    <div className="bg-gray-300 px-2 py-1 font-semibold text-[12px]">
      {title}
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex gap-2 mb-1">
    <span className="w-[120px]">{label}</span>
    <span>:</span>
    <span>{value}</span>
  </div>
);
/* ================= 4C COMPONENT ================= */

const FourC = ({ title, items, cols }) => {
  const grid =
    cols === 6 ? "grid-cols-6"
    : cols === 5 ? "grid-cols-5"
    : "grid-cols-3";

  return (
    <Section title={title}>
      <div className={`grid ${grid} gap-4 text-center`}>
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={item.image}
              alt={item.label}
              className="h-14 w-14 object-contain bg-white border rounded-full"
            />
            <p className="text-[10px] mt-1 whitespace-pre-line text-center">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};



const ScaleRow = ({ labels, selected = [] }) => (
  <div className="relative mt-4">
    <div className="absolute left-0 right-0 bottom-6 h-[1px] bg-gray-600"></div>
    <div className="flex">
      {labels.map((l) => (
        <div key={l} className="flex-1 text-center relative">
          <div className="border-l border-gray-600 h-10 mx-auto" />
          {selected.includes(l) && (
            <span className="absolute inset-0 flex items-center justify-center font-bold">
              ×
            </span>
          )}
          <p className="text-[9px] mt-2">{l}</p>
        </div>
      ))}
    </div>
  </div>
);
