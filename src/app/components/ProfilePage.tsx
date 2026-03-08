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

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide">Profile</span>
        <div className="w-8" />
      </div>

      {/* Profile Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-black text-xl">
            {user.name.charAt(0)}
          </span>
        </div>
        <h2 className="text-black mb-1">{user.name}</h2>
        <p className="text-gray-400 text-xs mb-1 capitalize">{user.role}</p>
        <p className="text-gray-500 text-sm mb-8">{user.organization}</p>

        <div className="w-full max-w-[260px] space-y-3">
          <div className="border border-gray-200 p-3 flex justify-between">
            <span className="text-xs text-gray-400">Role</span>
            <span className="text-xs text-black capitalize">{user.role}</span>
          </div>
          <div className="border border-gray-200 p-3 flex justify-between">
            <span className="text-xs text-gray-400">Organization</span>
            <span className="text-xs text-black">{user.organization}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 px-8 py-2 border border-black text-black text-xs"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}