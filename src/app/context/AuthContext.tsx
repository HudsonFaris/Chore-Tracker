import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth, db } from "../../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string | null;
  name: string;
  role: "manager" | "resident" | null;
  org_id: string;
  organizationName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: data.email || firebaseUser.email,
              name: data.name,
              role: data.role,
              org_id: data.org_id,
              organizationName: data.organizationName || "",
            });
          } else {
            setUser(null);
          }
        } else {
          const stored = localStorage.getItem("residentSession");
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth sync error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (userData.role === "resident") {
      localStorage.setItem("residentSession", JSON.stringify(userData));
    }
  };

  const logout = async () => {
    localStorage.removeItem("residentSession");
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

