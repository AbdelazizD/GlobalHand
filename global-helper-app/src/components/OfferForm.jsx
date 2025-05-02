import { useState } from "react";
import { addDoc, collection, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { updateDoc, increment } from "firebase/firestore";

export default function OfferForm({ taskId, currentUser, existingOffer, onOfferSubmitted, onWithdrawOffer }) {
  const [message, setMessage] = useState(existingOffer ? existingOffer.message : "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      // Add new offer if not already submitted
      if (!existingOffer) {
        await addDoc(collection(db, "requests", taskId, "offers"), {
          volunteerId: currentUser.uid,
          volunteerName: currentUser.displayName || "Anonymous",
          message: message.trim(),
          status: "pending",
          createdAt: serverTimestamp(),
        });
        onOfferSubmitted(); // refresh drawer state
        await updateDoc(doc(db, "requests", taskId), {
          offerCount: increment(1),
        });
      } else {
        // If the user is editing, update the existing offer
        const offerRef = doc(db, "requests", taskId, "offers", existingOffer.id);
        await updateDoc(offerRef, { message: message.trim() });
        onOfferSubmitted(); // refresh drawer state
      }

      setMessage("");
    } catch (err) {
      console.error("Error submitting offer:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdrawOffer = async () => {
    if (!existingOffer || !existingOffer.id) return;

    const offerRef = doc(db, "requests", taskId, "offers", existingOffer.id);
    const taskRef = doc(db, "requests", taskId);

    try {
      // Delete the offer
      await deleteDoc(offerRef);
      // Decrement the offer count
      await updateDoc(taskRef, {
        offerCount: increment(-1),
      });

      // Trigger callback to update UI after withdrawal
      onWithdrawOffer();
    } catch (err) {
      console.error("Error withdrawing offer:", err);
      alert("Failed to withdraw offer. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Write your offer message..."
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Offer"}
      </button>

      {existingOffer && (
        <button
          type="button"
          onClick={handleWithdrawOffer}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50"
        >
          Withdraw Offer
        </button>
      )}
    </form>
  );
}
