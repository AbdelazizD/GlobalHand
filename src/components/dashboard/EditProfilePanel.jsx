import { IoClose } from "react-icons/io5";
import { useState, useRef } from "react";
import {
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { defaultAvatars } from "../../data/avatar";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function EditProfilePanel({ user, onClose }) {
  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileUpload = (file) => {
    const fileRef = ref(storage, `avatars/${user.uid}/${file.name}`);
    setLoading(true);
    uploadBytes(fileRef, file)
      .then(() => getDownloadURL(fileRef))
      .then((url) => {
        setFormData((prev) => ({ ...prev, photoURL: url }));
      })
      .catch((err) => {
        console.error("Upload failed", err);
        alert("Upload failed. Try again.");
      })
      .finally(() => setLoading(false));
  };

  const handleAvatarSelect = (url) =>
    setFormData((prev) => ({ ...prev, photoURL: url }));

  const handleRemovePhoto = () =>
    setFormData((prev) => ({ ...prev, photoURL: "" }));

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    const updates = {};
    if (formData.displayName !== currentUser.displayName) updates.displayName = formData.displayName;
    if (formData.photoURL !== currentUser.photoURL) updates.photoURL = formData.photoURL;

    try {
      if (formData.email !== currentUser.email) {
        if (!password) return alert("Enter your password to change email.");
        const cred = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, cred);
        await updateEmail(currentUser, formData.email);
      }
      if (Object.keys(updates).length) await updateProfile(currentUser, updates);

      await updateDoc(doc(db, "users", user.uid), {
        ...updates,
        email: formData.email,
        photoMeta: { uploadedAt: new Date().toISOString() },
      });

      alert("Profile updated!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed: " + err.message);
    }
  };

  return (
<div className="w-full max-w-xl bg-white p-6 rounded-md shadow mt-4">

      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      {loading && <p className="text-sm text-blue-500 mb-4">Uploading…</p>}

      <div className="space-y-4">
        {/* Photo Upload */}
        <div className="flex items-center space-x-3">
          {formData.photoURL ? (
            <img className="h-16 w-16 rounded-full object-cover" src={formData.photoURL} />
          ) : (
            <PhotoIcon className="h-16 w-16 text-gray-400" />
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className="py-1 px-3 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Upload from PC
          </button>
          <button
            onClick={handleRemovePhoto}
            className="py-1 px-3 text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
          />
        </div>

        {/* Default Avatars */}
        <div>
          <label className="text-sm font-medium text-gray-700">Choose a default avatar:</label>
          <div className="flex space-x-2 mt-2">
            {defaultAvatars.map((url) => (
              <img
                key={url}
                src={url}
                className={`h-10 w-10 rounded-full border cursor-pointer ${formData.photoURL === url ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleAvatarSelect(url)}
                alt="avatar"
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
          {formData.email !== user.email && (
            <input
              type="password"
              placeholder="Password to confirm"
              className="mt-2 block w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
