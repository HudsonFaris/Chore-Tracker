import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col flex-1 bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <span className="text-black font-bold tracking-widest text-sm uppercase">Chore Tracker</span>
        <button
          onClick={() => navigate("/profile")}
          className="px-3 py-1.5 border border-black text-black bg-white text-xs uppercase font-bold"
        >
          Profile
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg space-y-6">
          <div className="border border-gray-100 p-8">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Organization</p>
            <h2 className="text-2xl font-light text-black mb-1">{user.organizationName}</h2>
            <p className="text-gray-400 text-xs">
              {user.email || "Resident"} · <span className="capitalize">{user.role}</span>
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/chores")}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest"
            >
              View Chores
            </button>

            {user.role === "manager" && (
              <button
                onClick={() => navigate("/manage-residents")}
                className="w-full py-4 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Manage Residents
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}