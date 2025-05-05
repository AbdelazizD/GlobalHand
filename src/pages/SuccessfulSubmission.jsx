import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessfulSubmission() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 text-center p-6">
      <FaCheckCircle className="text-emerald-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-emerald-700 mb-2">Request Submitted Successfully!</h1>
      <p className="text-gray-700 mb-6 max-w-md">
        Thank you for sharing your request. Compassionate volunteers from around the world will now be able to view it and lend a hand where they can.
      </p>
      <Link
        to="/"
        className="inline-block bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
