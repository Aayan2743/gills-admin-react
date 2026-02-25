



import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const [dataSettingsOpen, setDataSettingsOpen] = useState(
  location.pathname.startsWith("/rate-card") ||
    location.pathname.startsWith("/clarity") ||
    location.pathname.startsWith("/items")
);


  const [clientOpen, setClientOpen] = useState(
    location.pathname.startsWith("/add-client") ||
      location.pathname.startsWith("/view-client")
  );

  const [confirmationOpen, setConfirmationOpen] = useState(
    location.pathname.startsWith("/confirmation")
  );

  const pageTitle =
    location.pathname.replace("/", "").toUpperCase() || "DASHBOARD";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
        <Sidebar
          open={open}
          setOpen={setOpen}
          user={user}
          logout={logout}
          clientOpen={clientOpen}
          setClientOpen={setClientOpen}
          confirmationOpen={confirmationOpen}
          setConfirmationOpen={setConfirmationOpen}
          dataSettingsOpen={dataSettingsOpen}
          setDataSettingsOpen={setDataSettingsOpen}
        />


      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between">
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <h2 className="font-semibold">{pageTitle}</h2>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              {user.name?.charAt(0)}
            </div>
            <span className="hidden md:block">{user.name}</span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
