import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ChevronLeft, Plus } from "lucide-react";

export function ChoreListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chores, setChores] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.org_id) return;

    //Fetch all chores for this organization
    const q = query(collection(db, "chores"), where("org_id", "==", user.org_id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const choreData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      //Managers see all, Residents see only theirs
      const filtered = user.role === "manager" 
        ? choreData 
        : choreData.filter((c: any) => c.assignedTo.includes(user.name)); //idk how this loop completely works but it works
      
      setChores(filtered);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <Navigate to="/" replace />;

  const statusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-gray-200 text-black";
      case "Overdue": return "bg-black text-white";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-screen">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide text-sm font-medium">
          {user.role === "manager" ? "Organization Chores" : "My Chores"}
        </span>
        <button onClick={() => navigate("/profile")} className="px-3 py-1.5 border border-black text-black text-xs">
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
          <div className="py-20 text-center text-gray-400 text-sm">No chores found.</div>
        ) : (
          chores.map((chore) => (
            <button
              key={chore.id}
              onClick={() => navigate(`/chore/${chore.id}`)}
              className="w-full text-left border border-gray-200 p-4 bg-white hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-black text-sm font-medium">{chore.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {user.role === "manager" ? `Assigned to: ${chore.assignedTo.join(", ")}` : "Personal Task"}
                  </p>
                </div>
                <span className={`text-[10px] uppercase tracking-tighter px-2 py-0.5 ${statusColor(chore.status)}`}>
                  {chore.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-3 line-clamp-1">{chore.description}</p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>DUE: {chore.dueDate}</span>
                <span>{chore.dueTime}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}