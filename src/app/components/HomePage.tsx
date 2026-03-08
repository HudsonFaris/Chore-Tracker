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
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-black tracking-wide">Chore Tracker</span>
        <button
          onClick={() => navigate("/profile")}
          className="px-3 py-1.5 border border-black text-black bg-white text-xs"
        >
          Profile
        </button>
      </div>

      {/* Org Background Image */}
      <div className="relative flex-1 flex flex-col">
        <div className="absolute inset-0">
        </div>

        {/* Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6">
          <div className="bg-white border border-gray-200 px-8 py-10 flex flex-col items-center max-w-[300px] w-full">
            <h2 className="text-black mb-1">{user.organization}</h2>
            <p className="text-gray-500 text-sm mb-1">Chore Information</p>
            <p className="text-gray-400 text-xs mb-6">
              Signed in as {user.name} ({user.role})
            </p>
            <button
              onClick={() => navigate("/chores")}
              className="w-full py-3 bg-black text-white text-sm tracking-wide"
            >
              See Chores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}