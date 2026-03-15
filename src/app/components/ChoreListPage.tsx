import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ChevronLeft, Plus, Clock, Repeat, AlertCircle } from "lucide-react";

export function ChoreListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chores, setChores] = useState<any[]>([]);

  const statusColor = (status: string, extensionRequested?: boolean) => {
    if (extensionRequested && user?.role === "manager") {
      return "bg-orange-100 text-orange-700 border border-orange-200";
    }
    switch (status) {
      case "Completed":
        return "bg-gray-100 text-gray-600";
      case "Overdue":
        return "bg-black text-white";
      default:
        return "bg-white text-gray-500 border border-gray-200";
    }
  };

  useEffect(() => {
    if (!user?.org_id) return;

    const q = query(collection(db, "chores"), where("org_id", "==", user.org_id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const choreData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const filtered = user.role === "manager" 
        ? choreData 
        : choreData.filter((c: any) => c.assignedTo.includes(user.name));
      
      setChores(filtered);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="flex flex-col flex-1 bg-white min-h-screen">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide text-sm font-medium uppercase">
          {user.role === "manager" ? "Organization Chores" : "My Chores"}
        </span>
        <button onClick={() => navigate("/profile")} className="px-3 py-1.5 border border-black text-black text-[10px] uppercase font-bold">
          Profile
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {user.role === "manager" && (
          <button
            onClick={() => navigate("/chores/create")}
            className="w-full border border-dashed border-gray-300 p-4 flex items-center justify-center gap-2 text-gray-400 text-xs hover:border-black hover:text-black transition-colors"
          >
            <Plus size={16} /> Add New Task
          </button>
        )}

        {chores.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm italic">No chores found.</div>
        ) : (
          chores.map((chore) => (
            <button
              key={chore.id}
              onClick={() => navigate(`/chore/${chore.id}`)}
              className="w-full text-left border border-gray-200 p-4 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-black text-sm font-bold">{chore.title}</p>
                    {/* Recurring Badge */}
                    {chore.frequency && chore.frequency !== "once" && (
                      <Repeat size={12} className="text-blue-500" />
                    )}
                  </div>
                  
                  {chore.extensionRequested && user.role === "manager" && (
                    <div className="flex items-center gap-1 text-[9px] text-orange-600 font-bold uppercase tracking-tighter">
                      <AlertCircle size={10} /> Extension Requested
                    </div>
                  )}

                  <p className="text-gray-400 text-[10px] uppercase tracking-tighter">
                    {user.role === "manager" ? `Assigned to: ${chore.assignedTo.join(", ")}` : "Personal Task"}
                  </p>
                </div>
                
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${statusColor(chore.status, chore.extensionRequested)}`}>
                  {chore.status}
                </span>
              </div>
              
              <p className="text-gray-500 text-xs mb-4 line-clamp-1 italic">"{chore.description}"</p>
              
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>DUE: {chore.dueDate} @ {chore.dueTime}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}