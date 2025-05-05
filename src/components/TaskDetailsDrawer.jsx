import { useState, useEffect } from "react";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { IoClose } from "react-icons/io5";
import Flag from "react-world-flags";
import { db } from "@/firebase";
import { doc, updateDoc, increment, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import OfferForm from "@/components/OfferForm";
import OffersManager from "./OffersManager";

export default function TaskDetailsDrawer({ task, currentUser, onClose, className = "" }) {
  const [existingOffer, setExistingOffer] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [checkingOffer, setCheckingOffer] = useState(true);

  // Fetch existing offer
  useEffect(() => {
    const fetchExistingOffer = async () => {
      setCheckingOffer(true);
      const offersQuery = query(
        collection(db, "requests", task.id, "offers"),
        where("volunteerId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(offersQuery);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setExistingOffer({ id: doc.id, ...doc.data() });
      }
      setCheckingOffer(false);
    };

    if (task && currentUser) {
      fetchExistingOffer();
    }
  }, [task, currentUser]);

  const handleWithdrawOffer = async () => {
    if (!existingOffer || !existingOffer.id) return;

    const offerRef = doc(db, "requests", task.id, "offers", existingOffer.id);
    const taskRef = doc(db, "requests", task.id);

    try {
      await deleteDoc(offerRef);
      await updateDoc(taskRef, {
        offerCount: increment(-1),
      });
      setExistingOffer(null); // clear offer state
    } catch (err) {
      console.error("Error withdrawing offer:", err);
      alert("Failed to withdraw offer. Please try again.");
    }
  };

  const points = typeof task.points === "number" ? task.points : 1;
  const hearts = Array.from({ length: points });
  const createdDate = task.createdAt?.toDate ? task.createdAt.toDate() : new Date();

  return (
    <div className={`w-full h-full bg-white shadow-lg overflow-y-auto relative z-20 ${className}`}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
        <IoClose size={24} />
      </button>

      <div className="p-6 pt-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={task.avatar || "/default-avatar.png"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border border-emerald-500"
          />
          <div className="flex space-x-1">
            {hearts.map((_, i) => (
              <FaHeart key={i} className="text-emerald-500" />
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-800 mb-4">{task.description}</p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Flag
            code={task.countryCode || "AU"}
            style={{ width: 20, height: 14, borderRadius: 2 }}
          />
          <span className="ml-2">{task.location || "Unknown Location"}</span>
          <FaMapMarkerAlt className="ml-2 text-gray-500" />
        </div>

        {/* Time since posted */}
        <p className="text-xs text-gray-500 mb-6">
          Posted {formatDistanceToNow(createdDate, { addSuffix: true })}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          {currentUser?.role === "volunteer" && (
            <div className="space-y-2 mt-6">
              {checkingOffer ? (
                <p className="text-sm text-gray-500">Checking your offer status...</p>
              ) : existingOffer ? (
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <p className="text-sm text-gray-700 mb-2">
                    You've already made an offer:
                  </p>
                  <p className="text-gray-800">{existingOffer.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status: <span className="capitalize">{existingOffer.status}</span>
                  </p>
                  <button
                    onClick={handleWithdrawOffer}
                    className="mt-3 text-sm text-red-500 hover:underline"
                  >
                    Withdraw Offer
                  </button>
                </div>
              ) : showOfferForm ? (
                <OfferForm
                  taskId={task.id}
                  currentUser={currentUser}
                  existingOffer={existingOffer}
                  onOfferSubmitted={() => setExistingOffer({ ...existingOffer, message })}
                  onWithdrawOffer={() => {
                    setExistingOffer(null); // clear the existing offer from state
                  }}
                  />
              ) : (
                <button
                  className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition"
                  onClick={() => setShowOfferForm(true)}
                >
                  Make an Offer
                </button>
              )}
            </div>
          )}

          <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition">
            Ask a Question
          </button>
        </div>

        {/* Task Owner (Manage Offers) */}
        {currentUser?.uid === task.createdBy && (
          <OffersManager taskId={task.id} />
        )}
      </div>
    </div>
  );
}
