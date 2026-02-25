import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Employees from "./pages/Employees";
import AddClient from "./pages/AddClient";
import ViewClient from "./pages/ViewClient";
import EditClient from "./pages/EditClient";
import Confirmation from "./pages/Confirmation";
import ConfirmationList from "./pages/ConfirmationList";
import JobConfirmation from "./pages/JobConfirmation";
import ConfirmationPrint from "./pages/ConfirmationPrint";
import InvoiceCashMemoList from "./pages/InvoiceCashMemoList";
import InvoicePrint from "./pages/InvoicePrint";
import InvoiceWithLogoPrint from "./pages/InvoiceWithLogoPrint";
import ExtraCharges from "./pages/ExtraCharges";
import CashMemoPrint from "./pages/CashMemoPrint";
import RateCard from "./pages/RateCard";
import Category from "./pages/Category";
import Clarity from "./pages/Clarity";
import Item from "./pages/Item";
import Color from "./pages/Color";
import Cut from "./pages/Cut";
import Metal from "./pages/Metal";
import JewelleryJobCard from "./pages/JewelleryJobCard";
import GemStoneJobCard from "./pages/GemStoneJobCard";
import DimondJobCard from "./pages/DimondJobCard";
import BigCertificate from "./pages/BigCertificate";

import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import EditJobCard from "./pages/EditJobCard";
import CertificatePreview from "./pages/CertificatePreview";
import EditGemJobCard from "./pages/EditGemJobCard";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected routes with layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/add-client" element={<AddClient />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/view-client" element={<ViewClient />} />
          <Route path="/edit-client/:id" element={<EditClient />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/confirmation-list" element={<ConfirmationList />} />
          <Route
            path="/invoice-cash-memo-list"
            element={<InvoiceCashMemoList />}
          />

          <Route path="/edit-confirmation/:id" element={<JobConfirmation />} />
          <Route path="/invoice/:id" element={<InvoicePrint />} />
          <Route path="/invoice-logo/:id" element={<InvoiceWithLogoPrint />} />
          <Route path="/extra-charge/:id" element={<ExtraCharges />} />
          <Route path="/cash-memo/:id" element={<CashMemoPrint />} />
          <Route path="/services" element={<Category />} />
          <Route path="/clarity" element={<Clarity />} />
          <Route path="/items" element={<Item />} />
          <Route path="/colors" element={<Color />} />
          <Route path="/cuts" element={<Cut />} />
          <Route path="/metal" element={<Metal />} />
          <Route path="/jewellery-job-card" element={<JewelleryJobCard />} />
          <Route path="/gem-stone-job-card" element={<GemStoneJobCard />} />
          <Route path="/diamond-job-card" element={<DimondJobCard />} />

          <Route path="/edit-job-card/:id" element={<EditJobCard />} />
          <Route path="/edit-gem-stone-job-card/:id" element={<EditGemJobCard />} />



          <Route
            path="/confirmation-print/:id"
            element={<ConfirmationPrint />}
          />

           <Route path="/certificates/preview" element={<CertificatePreview />} />
           <Route path="/certificates/big-preview" element={<BigCertificate />} />

          <Route path="/rate-card" element={<RateCard />} />
          {/* <Route path="/clarity" element={<Clarity />} />
          <Route path="/items" element={<Items />} /> */}
        </Route>

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
