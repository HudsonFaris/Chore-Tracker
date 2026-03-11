import { useState } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "../../firebase"; 

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc,
  getDoc //Added missing import, getDocs and getDoc will serve 2 different purposes, might change later. 
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft } from "lucide-react";

type ViewState = "welcome" | "resident_login" | "manager_login" | "manager_signup";

export function LoginPage() {
  const [view, setView] = useState<ViewState>("welcome");
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    orgName: "", 
    pin: "",
    name: "" // dded name to state for signups
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleResidentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const orgQ = query(collection(db, "organizations"), where("org_id", "==", formData.orgName));
      const orgSnap = await getDocs(orgQ);

      if (orgSnap.empty) {
        setError("Organization not found. Check the spelling (it is case-sensitive).");
        setLoading(false);
        return;
      }
      
      const orgId = orgSnap.docs[0].id;

      const userQ = query(collection(db, "users"), 
        where("org_id", "==", orgId), 
        where("pin", "==", formData.pin)
      );
      const userSnap = await getDocs(userQ);

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        login({
          uid: userSnap.docs[0].id,
          name: userData.name || "Resident",
          email: null,
          role: "resident",
          org_id: orgId,
          organizationName: formData.orgName
        }); 
        navigate("/home");
      } else {
        setError("Invalid PIN for this organization.");
      }
    } catch (err: any) {
      console.error("Resident login error:", err);
      setError(err.message || "Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      if (!userCred.user.emailVerified) {
        setError("Please verify your email address before logging in.");
        return;
      }

      const orgQ = query(collection(db, "organizations"), where("org_id", "==", formData.orgName));
      const orgSnap = await getDocs(orgQ);
      if (orgSnap.empty) { setError("That organization does not exist."); return; }

      const actualOrgId = orgSnap.docs[0].id;
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
      if (!userDoc.exists()) { setError("User profile not found."); return; }

      const userData = userDoc.data();
      if (userData.org_id !== actualOrgId || userData.role !== "manager") {
        setError("You are not authorized to manage this organization.");
        return;
      }

      //no login here... onAuthStateChanged will fire and set the user automatically
      navigate("/home");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleManagerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orgCheckQ = query(collection(db, "organizations"), where("org_id", "==", formData.orgName));
      const orgCheckSnap = await getDocs(orgCheckQ);

      if (!orgCheckSnap.empty) {
        setError("This organization name is already taken.");
        setLoading(false);
        return;
      }

      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCred.user);

      const orgRef = await addDoc(collection(db, "organizations"), {
        org_id: formData.orgName, 
        manager_uid: userCred.user.uid
      });

      //Save name along with other data
      await setDoc(doc(db, "users", userCred.user.uid), {
        name: formData.name, //formm here
        email: formData.email,
        role: "manager",
        org_id: orgRef.id
      });

      alert("Organization created! Verify your email before logging in.");
      setView("manager_login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white items-center justify-center px-6">
      {view !== "welcome" && (
        <button 
          onClick={() => { setView("welcome"); setError(""); }}
          className="absolute top-6 left-6 flex items-center text-sm text-gray-500 hover:text-black"
        >
          <ChevronLeft size={16} /> Back
        </button>
      )}

      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs border border-red-200 rounded">
            {error}
          </div>
        )}

        {view === "welcome" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Chore Tracker</h1>
            <p className="text-gray-500 text-sm">Select your role to access your house dashboard.</p>
            <div className="space-y-3 pt-4">
              <button onClick={() => setView("resident_login")} className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors">
                Resident Sign In
              </button>
              <button onClick={() => setView("manager_login")} className="w-full py-3 border-2 border-black font-medium rounded-md hover:bg-gray-50 transition-colors">
                Manager Portal
              </button>
            </div>
          </div>
        )}

        {view === "resident_login" && (
          <form onSubmit={handleResidentLogin} className="space-y-4">
            <h2 className="text-xl font-bold">Resident Access</h2>
            <input 
              required
              placeholder="Organization Name" 
              className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none"
              onChange={(e) => setFormData({...formData, orgName: e.target.value})} 
            />
            <input 
              required
              type="password"
              placeholder="4-Digit PIN" 
              maxLength={4}
              className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none tracking-widest"
              onChange={(e) => setFormData({...formData, pin: e.target.value})} 
            />
            <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-medium rounded-md disabled:bg-gray-400">
              {loading ? "Verifying..." : "Enter House"}
            </button>
          </form>
        )}

        {view === "manager_login" && (
          <form onSubmit={handleManagerLogin} className="space-y-4">
            <h2 className="text-xl font-bold">Manager Login</h2>
            <input 
              required
              placeholder="Organization Name" 
              className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none"
              onChange={(e) => setFormData({...formData, orgName: e.target.value})} 
            />
            <input 
              required
              type="email"
              placeholder="Email Address" 
              className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <input 
              required
              type="password"
              placeholder="Password" 
              className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-medium rounded-md disabled:bg-gray-400">
              {loading ? "Logging in..." : "Sign In"}
            </button>
            <button type="button" onClick={() => setView("manager_signup")} className="w-full text-xs text-gray-500 hover:underline">
              Create an organization here.
            </button>
          </form>
        )}

        {view === "manager_signup" && (
          <form onSubmit={handleManagerSignup} className="space-y-4">
            <h2 className="text-xl font-bold">Register Organization</h2>
            <input required placeholder="Your Full Name" className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Admin Email" className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input required type="password" placeholder="Password" className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <input required placeholder="Organization Name" className="w-full p-3 border-2 border-gray-100 rounded-md focus:border-black outline-none" onChange={(e) => setFormData({...formData, orgName: e.target.value})} />
            <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white font-medium rounded-md disabled:bg-gray-400">
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}