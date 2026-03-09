import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ChevronLeft, Clock, Camera } from "lucide-react";

export function ChoreDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chore, setChore] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "chores", id), (snap) => {
      if (snap.exists()) setChore({ id: snap.id, ...snap.data() });
    });
    return () => unsubscribe();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    await updateDoc(doc(db, "chores", id), { status: newStatus });
  };

  const requestExtension = async () => {
    if (!id) return;
    await updateDoc(doc(db, "chores", id), { extensionRequested: true });
  };

  if (!chore) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => navigate("/chores")}><ChevronLeft size={20}/></button>
        <span className="text-xs uppercase font-bold tracking-widest">{chore.title}</span>
        <div className="w-8" />
      </div>

      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-light mb-2">{chore.title}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{chore.description}</p>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-gray-50">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase">Deadline</p>
            <p className="text-sm font-medium">{chore.dueDate} at {chore.dueTime}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase">Status</p>
            <p className="text-sm font-bold">{chore.status}</p>
          </div>
        </div>

        {user?.role === "resident" && chore.status !== "Completed" && (
          <div className="space-y-3">
            <button 
              onClick={() => updateStatus("Completed")}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase"
            >
              Mark as Finished
            </button>
            {!chore.extensionRequested && (
              <button 
                onClick={requestExtension}
                className="w-full py-4 border border-black text-xs font-bold uppercase flex items-center justify-center gap-2"
              >
                <Clock size={14}/> Request Extension
              </button>
            )}
          </div>
        )}

        {user?.role === "manager" && chore.extensionRequested && (
          <div className="p-4 bg-gray-50 border space-y-3">
            <p className="text-xs text-center font-bold">Extension Requested</p>
            <div className="flex gap-2">
              <button onClick={() => updateDoc(doc(db, "chores", chore.id), { extensionRequested: false })} className="flex-1 py-2 bg-black text-white text-xs">Approve</button>
              <button onClick={() => updateDoc(doc(db, "chores", chore.id), { extensionRequested: false })} className="flex-1 py-2 border border-black text-xs">Deny</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}