import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { chores } from "../data/chores";
import { ChevronLeft, Plus } from "lucide-react";

export function ChoreListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isManager = user.role === "manager";

  // Residents see only their chores, managers see all
  const visibleChores = isManager
    ? chores
    : chores.filter((c) => c.assignedTo === user.name);

  const statusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gray-200 text-black";
      case "In Progress":
        return "bg-gray-100 text-gray-700";
      case "Overdue":
        return "bg-black text-white";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-black tracking-wide text-sm">
            {isManager ? "Chore List" : `${user.organization} Chores`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isManager && (
            <button
              onClick={() => navigate("/chores/create")}
              className="px-3 py-1.5 bg-black text-white text-xs"
            >
              Make Task
            </button>
          )}
          <button
            onClick={() => navigate("/profile")}
            className="px-3 py-1.5 border border-black text-black bg-white text-xs"
          >
            Profile
          </button>
        </div>
      </div>

      {/* Tab bar for manager */}
      {isManager && (
        <div className="flex border-b border-gray-200">
          <div className="flex-1 py-2 text-center text-xs border-b-2 border-black text-black">
            All Chores
          </div>
          <div className="flex-1 py-2 text-center text-xs text-gray-400">
            By Resident
          </div>
        </div>
      )}

      {/* Chore Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isManager && (
          <button
            onClick={() => navigate("/chores/create")}
            className="w-full border border-dashed border-gray-300 p-4 flex items-center justify-center gap-2 text-gray-400 text-xs"
          >
            <Plus size={16} />
            Add New Task
          </button>
        )}
        {visibleChores.map((chore) => (
          <button
            key={chore.id}
            onClick={() => navigate(`/chore/${chore.id}`)}
            className="w-full text-left border border-gray-200 p-4 bg-white"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-black text-sm">
                  {chore.category} : {chore.title}
                </p>
                {isManager && (
                  <p className="text-gray-400 text-xs mt-0.5">
                    Assigned to: {chore.assignedTo}
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${statusColor(chore.status)}`}
              >
                {chore.status}
              </span>
            </div>
            <p className="text-gray-500 text-xs mb-2">{chore.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {chore.choreDay} — Due {chore.dueTime}
              </span>
              <span className="text-xs text-gray-400">{chore.dueDate}</span>
            </div>
          </button>
        ))}

        {visibleChores.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-400 text-sm">No chores assigned to you</p>
          </div>
        )}
      </div>
    </div>
  );
}