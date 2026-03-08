import { useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../../firebase"; //db import for Firestore queries
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { REGEXP_ONLY_DIGITS } from "input-otp"; 

export function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePinSubmit = async (enteredPin: string) => {
    try {
      //Query Firestore for a user with this PIN
      const q = query(collection(db, "users"), where("pin", "==", enteredPin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        //Log them in with their actual role from the DB
        login(userData.role); 
        navigate("/home");
      } else {
        setError("Invalid PIN. Please try again.");
        setPin(""); //\Clear input on failure
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Try again.");
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white items-center justify-center px-6">
      <h1 className="text-xl font-bold mb-4">Enter Organization PIN</h1>
      
      {/* placeholder for now - otp */}
      <input
        type="password"
        value={pin}
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