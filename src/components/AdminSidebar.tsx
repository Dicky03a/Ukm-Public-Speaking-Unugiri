import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Newspaper, Users, Image as ImageIcon, LogOut, Mic2, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Berita", path: "/admin/news", icon: Newspaper },
    { name: "Pengurus", path: "/admin/members", icon: Users },
    { name: "Galeri", path: "/admin/gallery", icon: ImageIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-100 min-h-screen flex flex-col sticky top-0">
      <div className="p-8 border-b border-gray-50 mb-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Mic2 className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">
            UKM <span className="text-primary">Admin</span>
          </span>
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all group ${
              location.pathname === item.path ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.name}</span>
            </div>
            <ChevronRight size={16} className={`${location.pathname === item.path ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-50">
        <div className="p-4 bg-gray-50 rounded-2xl mb-4">
          <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
