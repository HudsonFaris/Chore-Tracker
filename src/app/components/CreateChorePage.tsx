import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ChevronLeft, Check, Camera } from "lucide-react";



export function CreateChorePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [residents, setResidents] = useState<any[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [uploadProof, setUploadProof] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [frequency, setFrequency] = useState<"once" | "weekly" | "bi-weekly">("once");


  useEffect(() => {
    const fetchResidents = async () => {
      if (!user?.org_id) return;
      const q = query(collection(db, "users"), where("org_id", "==", user.org_id), where("role", "==", "resident"));
      const snap = await getDocs(q);
      setResidents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchResidents();
  }, [user]);

  if (!user || user.role !== "manager") return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || selectedPeople.length === 0) return;

    await addDoc(collection(db, "chores"), {
      title: task,
      description,
      assignedTo: selectedPeople,
      org_id: user.org_id,
      status: "In Progress",
      dueDate,
      dueTime,
      frequency,
      uploadProof,
      extensionRequested: false,
      createdAt: new Date()
    });

    setSubmitted(true);
    setTimeout(() => navigate("/chores"), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/chores")} className="p-1"><ChevronLeft size={20}/></button>
        <span className="text-sm font-medium">Create New Task</span>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {submitted ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Check className="text-white" />
            </div>
            <p className="text-sm">Chore Assigned Successfully</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <input required placeholder="Task Title" className="w-full p-3 border-b outline-none focus:border-black" onChange={e => setTask(e.target.value)} />
              <textarea placeholder="Description / Steps" className="w-full p-3 border-b outline-none focus:border-black resize-none" rows={2} onChange={e => setDescription(e.target.value)} />
            </div>
              <div>
              <label className="text-xs text-gray-400 block mb-3 uppercase tracking-widest">Repeat Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {["once", "weekly", "bi-weekly"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f as any)}
                    className={`py-2 text-[10px] uppercase border ${
                      frequency === f ? "bg-black text-white border-black" : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-3 uppercase tracking-widest">Assign To</label>
              <div className="grid grid-cols-2 gap-2">
                {residents.map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedPeople(prev => prev.includes(r.name) ? prev.filter(p => p !== r.name) : [...prev, r.name])}
                    className={`p-2 text-xs border ${selectedPeople.includes(r.name) ? "bg-black text-white border-black" : "border-gray-200 text-gray-500"}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input required type="date" className="p-2 border text-xs" onChange={e => setDueDate(e.target.value)} />
              <input required type="time" className="p-2 border text-xs" onChange={e => setDueTime(e.target.value)} />
            </div>

            <button
              type="button"
              onClick={() => setUploadProof(!uploadProof)}
              className={`w-full py-3 border text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${uploadProof ? "bg-gray-100 border-black text-black" : "border-gray-200 text-gray-400"}`}
            >
              <Camera size={14} /> {uploadProof ? "Photo Proof Required" : "No Photo Required"}
            </button>

            <button type="submit" className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-bold">
              Confirm Assignment
            </button>
          </>
        )}
      </form>
    </div>
    
  );
}