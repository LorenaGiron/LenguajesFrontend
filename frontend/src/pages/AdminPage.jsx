import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-grisC">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64">
        <Topbar />

        <main className="flex-1 p-8 pt-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
