import { createContext, useContext, useState, ReactNode } from "react";

//logged out states and roles
type Role = "manager" | "resident" | null;

interface User {
  uid: string;
  email: string | null;
  role: Role;
  org_id: string; //Firestore Document ID (e.g., AnlqqjMcuJT6...)
  organizationName: string; //isplay name (e.g., ATO-Beta-Delta)
}

interface AuthContextType {
  user: User | null;
  //Updated login to accept the user object instead of just a string
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);


  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);