// import { useAuth } from "../auth/AuthContext";

// export default function Dashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome, {user.name}</p>
//       <p>Role: {user.role}</p>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to your admin dashboard.</p>
    </DashboardLayout>
  );
}
