import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: "manager" | "resident") => {
    login(role);
    navigate("/home");
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-black tracking-wide">Chore Tracker</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleLogin("manager")}
            className="px-3 py-1.5 border border-black text-black bg-white text-xs"
          >
            Manager Sign In
          </button>
          <button
            onClick={() => handleLogin("resident")}
            className="px-3 py-1.5 bg-black text-white text-xs"
          >
            Resident Sign In
          </button>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h1 className="text-black mb-2">Chore Helper</h1>
        <p className="text-gray-500 text-center text-sm max-w-[260px]">
          Please sign in to your organization to view and manage chores.
        </p>
      </div>

      {/* Bottom hint */}
      <div className="px-6 pb-8 text-center">
        <p className="text-gray-400 text-xs">
          Select your role above to get started
        </p>
      </div>
    </div>
  );
}