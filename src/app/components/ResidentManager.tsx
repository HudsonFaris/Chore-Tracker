import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, UserPlus, Users } from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore"; //exclusively for deleting residents

interface Resident {
  id: string;
  name: string;
  pin: string;
}

export function ResidentManager() {
  const [residentName, setResidentName] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.org_id) return;

    const q = query(
      collection(db, "users"),
      where("org_id", "==", user.org_id),
      where("role", "==", "resident")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const residentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resident[];
      setResidents(residentData);
    });

    return () => unsubscribe();
  }, [user?.org_id]);

  const handleDeleteResident = async (residentId: string, name: string) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
  
  if (confirmDelete) {
    try {
      const residentRef = doc(db, "residents", residentId);
      await deleteDoc(residentRef);
    } catch (error) {
      console.error("Error deleting resident:", error);
      alert("Failed to delete resident. Check your permissions.");
    }
  }
};

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.org_id) return setMessage("Not authorized.");
    if (pin.length !== 4) return setMessage("PIN must be 4 digits.");

    try {
      await addDoc(collection(db, "users"), {
        name: residentName,
        pin: pin,
        role: "resident",
        org_id: user.org_id,
        createdAt: new Date()
      });
      
      setMessage(`Added ${residentName} successfully!`);
      setResidentName("");
      setPin("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error adding resident.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} className="text-black" />
        </button>
        <span className="text-black tracking-wide font-medium">Manage Residents</span>
        <div className="w-8" />
      </div>

      <div className="p-6 max-w-md mx-auto w-full space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-900">
            <UserPlus size={18} />
            <h2 className="font-bold">Add New Resident</h2>
          </div>
          <form onSubmit={handleAddResident} className="space-y-3">
            <input 
              required
              placeholder="Resident Name (e.g. Room 101)" 
              value={residentName}
              className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-black"
              onChange={(e) => setResidentName(e.target.value)} 
            />
            <input 
              required
              placeholder="Assign 4-Digit PIN" 
              value={pin}
              maxLength={4}
              className="w-full p-3 border border-gray-200 rounded-md outline-none focus:border-black tracking-widest"
              onChange={(e) => setPin(e.target.value)} 
            />
            <button type="submit" className="w-full py-3 bg-black text-white rounded-md font-medium">
              Add Resident
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-center text-gray-600">{message}</p>}
        </section>

        <hr className="border-gray-100" />

        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-900">
            <Users size={18} />
            <h2 className="font-bold">Current Residents</h2>
          </div>
          <div className="space-y-2">
            {residents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No residents added yet.</p>
            ) : (
              residents.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-black">{r.name}</p>
                    <p className="text-xs text-gray-400">PIN: {r.pin}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteResident(r.id, r.name)}
                    className="text-xs font-semibold py-1 px-3 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}