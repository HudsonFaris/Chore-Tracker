import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; //context stores org_id for manager and residents, so we can link them together when adding residents

export function ResidentManager() {
  const [residentName, setResidentName] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth(); //org_id

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();

    //guard clause to ensure user is logged in and has an org_id
    if (!user || !user.org_id) {
      return setMessage("Error: You must be logged in as a manager to add residents.");
    }

    if (pin.length !== 4) return setMessage("PIN must be 4 digits.");

    try {
      //Add the resident using the org_id from the current manager's session
      await addDoc(collection(db, "users"), {
        name: residentName,
        pin: pin,
        role: "resident",
        org_id: user.org_id, // Links them to the manager's house
        createdAt: new Date()
      });
      
      setMessage(`Added ${residentName} successfully!`);
      setResidentName("");
      setPin("");
    } catch (err) {
      setMessage("Error adding resident.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Residents</h2>
      <form onSubmit={handleAddResident} className="space-y-4">
        <input 
          required
          placeholder="Resident Name (e.g. Room 101)" 
          value={residentName}
          className="w-full p-3 border rounded"
          onChange={(e) => setResidentName(e.target.value)} 
        />
        <input 
          required
          placeholder="Assign 4-Digit PIN" 
          value={pin}
          maxLength={4}
          className="w-full p-3 border rounded"
          onChange={(e) => setPin(e.target.value)} 
        />
        <button type="submit" className="w-full py-3 bg-black text-white rounded">
          Add Resident to House
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
}