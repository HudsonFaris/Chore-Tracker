import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft } from "lucide-react";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col flex-1 bg-white min-h-screen">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-widest text-xs font-bold uppercase">Profile</span>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-bold">{initial}</span>
            </div>
            <div>
              <h2 className="text-black text-xl font-bold">{user.name}</h2>
              <p className="text-gray-400 text-xs uppercase tracking-widest">{user.organizationName}</p>
            </div>
          </div>

          <div className="border border-gray-100 divide-y divide-gray-100">
            <div className="p-4 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Email</span>
              <span className="text-xs text-black">{user.email || "No email set"}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Role</span>
              <span className="text-xs text-black capitalize">{user.role}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Organization ID</span>
              <span className="text-xs text-black font-mono">{user.org_id}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-4 bg-black text-white text-[10px] uppercase font-bold tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}