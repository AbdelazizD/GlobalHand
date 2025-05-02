// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isVolunteer: false,
  compassionPoints: 0,
  loading: true,
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [compassionPoints, setCompassionPoints] = useState(0);  // Track compassion points
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));

          // Check if the user exists in Firestore
          if (snap.exists()) {
            const userData = snap.data();
            setIsVolunteer(userData.isVolunteer || false);

            // Initialize compassion points if not already set
            if (userData.compassionPoints === undefined) {
              // Set default compassion points (e.g., 0)
              await setDoc(doc(db, "users", fbUser.uid), {
                ...userData,
                compassionPoints: 0,
              }, { merge: true });
              setCompassionPoints(0);
            } else {
              setCompassionPoints(userData.compassionPoints);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsVolunteer(false);
          setCompassionPoints(0);  // Handle the error by setting default compassion points
        }
      } else {
        setUser(null);
        setIsVolunteer(false);
        setCompassionPoints(0);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isVolunteer,
        compassionPoints,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
