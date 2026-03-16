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
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide text-sm font-medium uppercase">Profile</span>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <div className="w-16 h-16 bg-black border border-black rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-xl font-bold">
            {initial}
          </span>
        </div>
        
      
        <h2 className="text-black text-lg font-bold mb-1">{user.name}</h2>
        <p className="text-gray-400 text-xs mb-8 uppercase tracking-widest">{user.organizationName}</p>

        <div className="w-full max-w-[280px] space-y-3">
          <div className="border border-gray-200 p-3 flex justify-between items-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Email</span>
            <span className="text-xs text-black">{user.email || "No email set"}</span>
          </div>
          <div className="border border-gray-200 p-3 flex justify-between items-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Role</span>
            <span className="text-xs text-black capitalize">{user.role}</span>
          </div>
          <div className="border border-gray-200 p-3 flex justify-between items-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Organization ID</span>
            <span className="text-xs text-black font-mono">{user.org_id}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-12 w-full max-w-[280px] py-4 bg-black text-white text-[10px] uppercase font-bold tracking-widest"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}