import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import EditProfilePanel from "./EditProfilePanel";
import watermelonIcon from '../../assets/watermelon-icon.png';

export default function ProfileCard({ user }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [compassionPoints, setCompassionPoints] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const fetchPoints = async () => {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setCompassionPoints(snap.data().compassionPoints || 0);
        }
      };
      fetchPoints();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center space-x-4">
        {user.photoURL ? (
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={user.photoURL}
            alt="Avatar"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-white">
            {user.displayName?.[0] || "?"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{user.displayName || "Unnamed User"}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>

          {/* Compassion Points */}
          {compassionPoints !== null && (
            <div className="flex items-center space-x-2 mt-2">
              <img src={watermelonIcon} alt="Watermelon" className="watermelon-icon h-6 w-6" />
              <p className="text-md text-gray-700">
                {compassionPoints} Compassion Points
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsPanelOpen(true)}
          className="ml-auto text-sm text-blue-600 hover:underline"
        >
          Edit Profile
        </button>
      </div>

      {isPanelOpen && (
        <EditProfilePanel
          user={user}
          onClose={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}
