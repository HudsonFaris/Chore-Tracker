import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../firebase";
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, UserPlus, Users } from "lucide-react";

//accomdate for both resident and staff management in one component for simplicity, but in a larger app these would likely be split into separate components and routes
//ResidentManager is responsible for allowing staff to add and remove residents. It listens in real-time to changes in the "users" collection filtered by the current org_id and role "resident". Residents are displayed in a list with their name and PIN, and staff can delete them with a confirmation prompt. A form at the top allows staff to add new residents by entering their name, email, and a 4-digit PIN.

//also declared sometypes here for simplicity, but in a larger app these would go in a separate file
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
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //Wait until auth is resolved and we have an org_id
    if (loading || !user || !user.org_id) {
      console.log("Auth not ready, skipping fetch...");
      return;
    }


    //refresh rate here is real-time via onSnapshot, so any changes to the residents in Firestore will immediately update the UI without needing to refresh the page. This provides a seamless experience for staff managing residents.
    
    console.log("Auth ready! Fetching residents for org:", user.org_id);

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

    //ubsubscribe from real-time updates when component unmounts or dependencies change (like user logging on)
    return () => unsubscribe();
  }, [user, loading]);


  if (loading) return <div className="p-10 text-center text-black">Authenticating...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">Access Denied. Please log in.</div>;

  const handleDeleteResident = async (residentId: string, name: string) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "users", residentId));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.org_id) return;
    try {
      await addDoc(collection(db, "users"), {
        name: residentName,
        pin: pin,
        role: "resident",
        email: email,
        org_id: user.org_id,
        createdAt: new Date()
      });
      setResidentName("");
      setPin("");
      setEmail("");
      setMessage("Added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error adding resident.");
    }
  };


  return (
    <div 
      key={user.uid}
      className="flex flex-col min-h-screen bg-white text-black"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate("/home")} className="p-1">
          <ChevronLeft size={20} />
        </button>
        <span className="font-medium">Manage Residents</span>
        <div className="w-8" />
      </div>

      <div className="p-6 max-w-md mx-auto w-full space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={18} />
            <h2 className="font-bold">Add New Resident</h2>
          </div>
          <form onSubmit={handleAddResident} className="space-y-3">
            <input 
              required
              placeholder="Resident Name" 
              value={residentName}
              className="w-full p-3 border border-gray-200 rounded-md bg-white text-black"
              onChange={(e) => setResidentName(e.target.value)} 
            />
            <input 
              required 
              type="email"
              placeholder="Resident Email" 
              className="w-full p-3 border border-gray-200 rounded-md bg-white text-black"
              onChange={e => setEmail(e.target.value)} 
            />
            <input 
              required
              placeholder="4-Digit PIN" 
              value={pin}
              maxLength={4}
              className="w-full p-3 border border-gray-200 rounded-md bg-white text-black tracking-widest"
              onChange={(e) => setPin(e.target.value)} 
            />
            <button type="submit" className="w-full py-3 bg-black text-white rounded-md font-medium">
              Add Resident
            </button>
          </form>
          {message && <p className="mt-2 text-center text-sm">{message}</p>}
        </section>

        <hr className="border-gray-100" />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} />
            <h2 className="font-bold">Current Residents</h2>
          </div>
          <div className="space-y-2">
            {residents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No residents added yet.</p>
            ) : (
              residents.map((r) => (
                <div key={r.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <p className="font-semibold text-black">{r.name}</p>
                    <p className="text-xs text-gray-500">PIN: {r.pin}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteResident(r.id, r.name)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-red-600 transition-all active:scale-95 flex-shrink-0"
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