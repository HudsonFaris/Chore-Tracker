import { useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../../firebase"; //
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  //toggle state between welcome and pin entry
  const [view, setView] = useState<"welcome" | "pin">("welcome");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePinSubmit = async (enteredPin: string) => {
    try {
      const q = query(collection(db, "users"), where("pin", "==", enteredPin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        login(userData.role); 
        navigate("/home");
      } else {
        setError("Invalid PIN. Please try again.");
        setPin(""); 
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Try again.");
    }
  };

  //welcome screen
  if (view === "welcome") {
    return (
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-black tracking-wide">Chore Tracker</span>
          <div className="flex gap-2">
            <button
              onClick={() => login("manager")} // Standard manager login
              className="px-3 py-1.5 border border-black text-black bg-white text-xs"
            >
              Manager Sign In
            </button>
            <button
              onClick={() => setView("pin")} // Switch to PIN view
              className="px-3 py-1.5 bg-black text-white text-xs"
            >
              Resident Sign In
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="text-black mb-2">Chore Helper</h1>
          <p className="text-gray-500 text-center text-sm max-w-[260px]">
            Please sign in to your organization to view and manage chores.
          </p>
        </div>

        <div className="px-6 pb-8 text-center">
          <p className="text-gray-400 text-xs">Select your role above to get started</p>
        </div>
      </div>
    );
  }

  //pin entry screen
  return (
    <div className="flex flex-col flex-1 bg-white items-center justify-center px-6">
      <button 
        onClick={() => setView("welcome")} 
        className="absolute top-4 left-4 text-xs text-gray-500 underline"
      >
        ← Back
      </button>
      <h1 className="text-xl font-bold mb-4">Enter Organization PIN</h1>
      <input
        type="password"
        value={pin}
        autoFocus
        onChange={(e) => {
          const val = e.target.value;
          if (val.length <= 4) setPin(val);
          if (val.length === 4) handlePinSubmit(val);
        }}
        className="w-48 h-12 border-2 border-black text-center text-2xl tracking-widest mb-4"
        placeholder="****"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <p className="text-gray-400 text-xs text-center">
        Contact your manager if you do not have a 4-digit PIN.
      </p>
    </div>
  );
}