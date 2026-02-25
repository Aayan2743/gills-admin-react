import { Link, useLocation } from "react-router-dom";
import { Palette, Scissors, Coins, ClipboardList, Gem } from "lucide-react";

export default function Sidebar({
  open,
  setOpen,
  user,
  logout,
  clientOpen,
  setClientOpen,
  confirmationOpen,
  setConfirmationOpen,
  dataSettingsOpen,
  setDataSettingsOpen,
}) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-indigo-100 text-indigo-600 font-semibold"
      : "text-gray-700 hover:bg-indigo-50";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      {/* FULL HEIGHT CONTAINER */}
      <div className="h-screen flex flex-col">
        {/* LOGO SECTION */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Gills Lab</h1>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>

        {/* SCROLLABLE NAV */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={`block px-4 py-2 rounded-lg ${isActive("/dashboard")}`}
          >
            📊 Dashboard
          </Link>

          {/* CLIENT MENU */}
          <button
            onClick={() => setClientOpen(!clientOpen)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-indigo-50"
          >
            <span>📁 Client</span>
            <span>{clientOpen ? "▾" : "▸"}</span>
          </button>

          {clientOpen && (
            <div className="ml-6 space-y-1">
              <Link
                to="/add-client"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/add-client")}`}
              >
                ➕ Add Client
              </Link>
              <Link
                to="/view-client"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/view-client")}`}
              >
                👁 View Client
              </Link>
            </div>
          )}

          {/* CONFIRMATION MENU */}
          <button
            onClick={() => setConfirmationOpen(!confirmationOpen)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-indigo-50"
          >
            <span>📁 Confirmation</span>
            <span>{confirmationOpen ? "▾" : "▸"}</span>
          </button>

          {confirmationOpen && (
            <div className="ml-6 space-y-1">
              <Link
                to="/confirmation"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/confirmation")}`}
              >
                ➕ Confirmation Entry
              </Link>
              <Link
                to="/confirmation-list"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/confirmation-list")}`}
              >
                👁 Confirmation List
              </Link>
            </div>
          )}

          <Link
            to="/invoice-cash-memo-list"
            onClick={() => setOpen(false)}
            className={`block px-4 py-2 rounded-lg ${isActive("/invoice-cash-memo-list")}`}
          >
            💰 Invoice & Cash Memo
          </Link>

          {/* DATA SETTINGS */}
          <button
            onClick={() => setDataSettingsOpen(!dataSettingsOpen)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-indigo-50"
          >
            <span>📊 Data Settings</span>
            <span>{dataSettingsOpen ? "▾" : "▸"}</span>
          </button>

          {dataSettingsOpen && (
            <div className="ml-6 space-y-1">
              <Link
                to="/rate-card"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/rate-card")}`}
              >
                💰 Rate Card
              </Link>

              <Link
                to="/clarity"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/clarity")}`}
              >
                🧾 Clarity
              </Link>

              <Link
                to="/items"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive("/items")}`}
              >
                📦 Items
              </Link>

              <Link
                to="/colors"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive("/colors")}`}
              >
                <Palette size={16} />
                <span>Colors</span>
              </Link>

              <Link
                to="/cuts"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive("/cuts")}`}
              >
                <Scissors size={16} />
                <span>Cut-Shape</span>
              </Link>

              <Link
                to="/metal"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive("/metal")}`}
              >
                <Coins size={16} />
                <span>Metal</span>
              </Link>

              <Link
                to="/jewellery-job-card"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive("/jewellery-job-card")}`}
              >
                <ClipboardList size={16} />
                <span>Jewellery Job Card</span>
              </Link>

              <Link
                to="/gem-stone-job-card"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive("/gem-stone-job-card")}`}
              >
                <Gem size={16} />
                <span>Gem Stone Job Card</span>
              </Link>

              <Link
                to="/diamond-job-card"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive("/diamond-job-card")}`}
              >
                <Gem size={16} />
                <span>Diamond Job Card</span>
              </Link>

              <Link
                to="/services"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50"
              >
                📦 Add Services
              </Link>
            </div>
          )}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
