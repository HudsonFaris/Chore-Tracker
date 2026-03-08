import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const mockResidents = [
  { name: "Alex", group: null },
  { name: "Jordan", group: "Group 1" },
  { name: "Sam", group: "Group 1" },
  { name: "Riley", group: "Group 2" },
  { name: "Casey", group: "Group 2" },
  { name: "Morgan", group: null },
];

const groups = ["Group 1", "Group 2"];

export function CreateChorePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [requireProof, setRequireProof] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user || user.role !== "manager") {
    return <Navigate to="/" replace />;
  }

  const togglePerson = (name: string) => {
    setSelectedPeople((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const toggleGroup = (group: string) => {
    const groupMembers = mockResidents
      .filter((r) => r.group === group)
      .map((r) => r.name);

    if (selectedGroups.includes(group)) {
      setSelectedGroups((prev) => prev.filter((g) => g !== group));
      setSelectedPeople((prev) =>
        prev.filter((p) => !groupMembers.includes(p))
      );
    } else {
      setSelectedGroups((prev) => [...prev, group]);
      setSelectedPeople((prev) => [
        ...prev,
        ...groupMembers.filter((m) => !prev.includes(m)),
      ]);
    }
  };

  const handleSubmit = () => {
    if (!task.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      navigate("/chores");
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/chores")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide text-sm">Make Task</span>
        <button
          onClick={() => navigate("/profile")}
          className="px-3 py-1.5 border border-black text-black bg-white text-xs"
        >
          Profile
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center mb-4">
              <span className="text-black">✓</span>
            </div>
            <p className="text-black text-sm">Task Created</p>
            <p className="text-gray-400 text-xs mt-1">Redirecting...</p>
          </div>
        ) : (
          <>
            {/* Task Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Task</label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g. Clean 2nd Floor Bathroom"
                className="w-full border border-gray-200 px-3 py-2 text-sm text-black bg-white placeholder:text-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task steps..."
                rows={3}
                className="w-full border border-gray-200 px-3 py-2 text-sm text-black bg-white placeholder:text-gray-300 resize-none"
              />
            </div>

            {/* People Selection */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                People
              </label>
              <div className="flex gap-4">
                {/* Individuals */}
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Residents</p>
                  <div className="border border-gray-200 p-2 space-y-1 max-h-[140px] overflow-y-auto">
                    {mockResidents.map((resident) => (
                      <button
                        key={resident.name}
                        onClick={() => togglePerson(resident.name)}
                        className={`w-full text-left px-2 py-1 text-xs ${
                          selectedPeople.includes(resident.name)
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {resident.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Groups */}
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Groups</p>
                  <div className="border border-gray-200 p-2 space-y-1">
                    {groups.map((group) => (
                      <button
                        key={group}
                        onClick={() => toggleGroup(group)}
                        className={`w-full text-left px-2 py-1 text-xs ${
                          selectedGroups.includes(group)
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {selectedPeople.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  Selected: {selectedPeople.join(", ")}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Time</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 border border-gray-200 px-3 py-2 text-sm text-black bg-white"
                />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="flex-1 border border-gray-200 px-3 py-2 text-sm text-black bg-white"
                />
              </div>
            </div>

            {/* Repeat Frequency */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Repeat Frequency</label>
              <button
                onClick={() => setRepeatWeekly(!repeatWeekly)}
                className={`w-4 h-4 border flex items-center justify-center ${
                  repeatWeekly ? "border-black bg-black" : "border-gray-300 bg-white"
                }`}
              >
                {repeatWeekly && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              <span className="text-xs text-gray-500">Every Week?</span>
            </div>

            {/* Require Proof */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Require Proof</label>
              <button
                onClick={() => setRequireProof(!requireProof)}
                className={`w-4 h-4 border flex items-center justify-center ${
                  requireProof ? "border-black bg-black" : "border-gray-300 bg-white"
                }`}
              >
                {requireProof && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              <span className="text-xs text-gray-500">Photo upload required</span>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={!task.trim()}
                className={`w-full py-3 text-sm tracking-wide ${
                  task.trim()
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Create Task
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
