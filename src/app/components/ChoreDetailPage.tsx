import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../../firebase";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ChevronLeft, Clock, Camera, Mail } from "lucide-react"; // Added Mail icon

export function ChoreDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chore, setChore] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  //keep regular query with modified permissions on firebase auth and firebnase storage

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "chores", id), (snap) => {
      if (snap.exists()) setChore({ id: snap.id, ...snap.data() });
    });
    return () => unsubscribe();
  }, [id]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `chores/${id}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "chores", id), { 
        imageUrl: url,
        status: "Pending Verification" 
      });
    } catch (err: any) {
      //log error
      console.error("Firebase Storage Error:", err);
      console.error("Error Code:", err.code);
      
      alert(`Upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteChore = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this chore and its proof?")) return;

    try {
      if (chore.imageUrl) {
        const storageRef = ref(storage, chore.imageUrl);
        await deleteObject(storageRef);
      }
      await deleteDoc(doc(db, "chores", id));
      navigate("/chores");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete chore.");
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    await updateDoc(doc(db, "chores", id), { status: newStatus });
  };

  const requestExtension = async () => {
    if (!id) return;
    await updateDoc(doc(db, "chores", id), { extensionRequested: true });
  };

  // NEW: Extension Approval logic (+24 hours)
  const approveExtension = async () => {
    if (!id || !chore.dueDate) return;
    const date = new Date(chore.dueDate + "T00:00:00");
    date.setDate(date.getDate() + 1);
    const newDate = date.toISOString().split('T')[0];
    
    await updateDoc(doc(db, "chores", id), { 
      dueDate: newDate,
      extensionRequested: false 
    });
  };

  // NEW: Email Reminder logic
  const sendEmailReminder = () => {
    const subject = encodeURIComponent(`Chore Reminder: ${chore.title}`);
    const body = encodeURIComponent(`Hi, this is a reminder to complete your task: ${chore.title}. It is currently due on ${chore.dueDate}.`);
    window.location.href = `mailto:${chore.residentEmail || ""}?subject=${subject}&body=${body}`;
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

        {chore.imageUrl && (
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Completion Proof</p>
            <img src={chore.imageUrl} alt="Proof" className="w-full h-64 object-cover border border-gray-100" />
          </div>
        )}

        {user?.role === "resident" && chore.status !== "Completed" && chore.status !== "Pending Verification" && (
          <div className="space-y-3">
            {chore.uploadProof ? (
              <div className="relative">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" disabled={uploading} />
                <label htmlFor="photo-upload" className="w-full py-4 border border-black text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer">
                  <Camera size={14}/> {uploading ? "Uploading..." : "Take Photo & Finish"}
                </label>
              </div>
            ) : (
              <button onClick={() => updateStatus("Completed")} className="w-full py-4 bg-black text-white text-xs font-bold uppercase">
                Mark as Finished
              </button>
            )}
            
            <button 
              onClick={requestExtension} 
              disabled={chore.extensionRequested}
              className={`w-full py-4 border text-xs font-bold uppercase flex items-center justify-center gap-2 ${chore.extensionRequested ? "border-gray-200 text-gray-400 cursor-default" : "border-black text-black"}`}
            >
              <Clock size={14}/> {chore.extensionRequested ? "Extension Requested" : "Request Extension"}
            </button>
          </div>
        )}

        {user?.role === "manager" && chore.status === "In Progress" && (
          <button 
            onClick={sendEmailReminder}
            className="w-full py-4 border border-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Mail size={14} /> Send Email Reminder
          </button>
        )}

        {user?.role === "manager" && chore.status === "Pending Verification" && (
          <div className="p-4 bg-gray-50 border border-black space-y-4">
            <p className="text-[10px] text-center font-bold uppercase">Review Completion</p>
            <div className="flex gap-2">
              <button onClick={() => updateStatus("Completed")} className="flex-1 py-3 bg-black text-white text-xs uppercase font-bold">Approve</button>
              <button onClick={() => updateStatus("In Progress")} className="flex-1 py-3 border border-black text-xs uppercase font-bold">Reject</button>
            </div>
          </div>
        )}

        {user?.role === "manager" && chore.extensionRequested && (
          <div className="p-4 bg-gray-50 border space-y-3">
            <p className="text-xs text-center font-bold">Extension Requested</p>
            <div className="flex gap-2">
              <button onClick={approveExtension} className="flex-1 py-2 bg-black text-white text-xs uppercase font-bold">Approve (+24h)</button>
              <button onClick={() => updateDoc(doc(db, "chores", id!), { extensionRequested: false })} className="flex-1 py-2 border border-black text-xs uppercase font-bold">Deny</button>
            </div>
          </div>
        )}
        
        {user?.role === "manager" && (
          <div className="pt-8 mt-8 border-t border-gray-100">
            <button 
              onClick={deleteChore}
              className="w-full py-4 border border-red-200 text-red-500 text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 transition-colors"
            >
              Delete Chore Permanently
            </button>
          </div>
        )}
      </div>
    </div>
  );
}