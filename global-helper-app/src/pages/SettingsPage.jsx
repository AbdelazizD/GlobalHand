// src/pages/SettingsPage.jsx
import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setDisplayName(data.displayName || "");
          setBio(data.bio || "");
          setLocation(data.location || "");
          setPhotoURL(data.photoURL || "");
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    const userRef = doc(db, "users", user.uid);
    let updatedData = {
      displayName,
      bio,
      location,
    };

    // Upload new profile picture
    if (photo) {
      const photoRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(photoRef, photo);
      const url = await getDownloadURL(photoRef);
      updatedData.photoURL = url;
      setPhotoURL(url); // update UI
    }

    await updateDoc(userRef, updatedData);
    alert("Profile updated!");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Profile Picture</label>
        <div className="flex items-center gap-4">
          <img
            src={photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <input type="file" onChange={handlePhotoChange} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Bio</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Location</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Save Changes
      </button>
    </div>
  );
}
