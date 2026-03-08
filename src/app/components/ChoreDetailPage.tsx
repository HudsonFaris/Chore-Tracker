import { useNavigate, useParams, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { chores } from "../data/chores";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function ChoreDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [extensionRequested, setExtensionRequested] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const chore = chores.find((c) => c.id === id);

  if (!chore) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <p className="text-gray-400">Chore not found</p>
        <button
          onClick={() => navigate("/chores")}
          className="mt-4 text-xs underline text-black"
        >
          Back to Chores
        </button>
      </div>
    );
  }

  const isManager = user.role === "manager";

  const statusStyle = () => {
    switch (chore.status) {
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
        <button onClick={() => navigate("/chores")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide text-sm">
          {chore.category} : {chore.title}
        </span>
        <button
          onClick={() => navigate("/profile")}
          className="px-3 py-1.5 border border-black text-black bg-white text-xs"
        >
          Profile
        </button>
      </div>

      {/* Chore Detail Card */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="border border-gray-200 bg-white">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-black">
              {chore.category} : {chore.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 ${statusStyle()}`}>
              {chore.status}
            </span>
          </div>

          {/* Body */}
          <div className="px-4 py-4 space-y-4">
            {/* Description */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-black">{chore.description}</p>
            </div>

            {/* Steps */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Steps</p>
              <ul className="space-y-1.5">
                {chore.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-gray-300 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs text-gray-400">
                      {chore.status === "Completed" ? "✓" : ""}
                    </span>
                    <span className="text-sm text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Due Info */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-400">{chore.choreDay}</p>
                  <p className="text-sm text-black">
                    {chore.dueDate} at {chore.dueTime}
                  </p>
                </div>
                {isManager && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Assigned To</p>
                    <p className="text-sm text-black">{chore.assignedTo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Proof */}
            {chore.uploadProof && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-2">
                  Upload Photo of proof after completion
                </p>
                <p className="text-xs text-gray-400">
                  Deadline: {chore.proofDeadline}
                </p>
                {!isManager && chore.status !== "Completed" && (
                  <button className="mt-2 w-full py-2 border border-black text-black text-xs">
                    Upload Proof
                  </button>
                )}
              </div>
            )}

            {/* Extension Request (Resident) */}
            {!isManager && chore.status !== "Completed" && (
              <div className="border-t border-gray-100 pt-4">
                {extensionRequested || chore.extensionRequested ? (
                  <p className="text-xs text-gray-500 text-center py-2">
                    Extension Requested
                  </p>
                ) : (
                  <button
                    onClick={() => setExtensionRequested(true)}
                    className="w-full py-2 bg-black text-white text-xs"
                  >
                    Request an Extension
                  </button>
                )}
              </div>
            )}

            {/* Manager Actions */}
            {isManager && (
              <div className="border-t border-gray-100 pt-4 space-y-2">
                {chore.extensionRequested && (
                  <div className="border border-gray-200 p-3">
                    <p className="text-xs text-gray-400 mb-2">
                      Extension Requested
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-black text-white text-xs">
                        Approve
                      </button>
                      <button className="flex-1 py-1.5 border border-black text-black text-xs">
                        Deny
                      </button>
                    </div>
                  </div>
                )}
                <button className="w-full py-2 border border-black text-black text-xs">
                  Mark as Reviewed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}