// src/pages/SignupPage.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "@/firebase"; // Assuming @ alias is configured
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Constant for Firestore collection
const USERS_COLLECTION = "users";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store user data in Firestore
      await setDoc(doc(db, USERS_COLLECTION, uid), {
        email,
        isVolunteer,
        joinedAt: serverTimestamp(), // Use server timestamp for consistency
        signUpMethod: "email",
      }, { merge: true }); // Use merge: true for consistency/safety

      navigate("/"); // Redirect to home or dashboard after signup
    } catch (err) {
      console.error("Signup error:", err);
      // Provide more user-friendly error messages if desired
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true); // Start loading immediately

    try {
      // *** Confirmation Check ***
      if (isVolunteer) {
        const confirmVolunteer = window.confirm(
          "You have indicated you want to sign up as a volunteer. \n\nProceed with Google Sign-In as a volunteer?"
        );

        // If the user clicks 'Cancel' in the confirmation dialog
        if (!confirmVolunteer) {
          setLoading(false); // Stop loading
          return; // Exit the function, don't proceed with sign-in
        }
        // If they click 'OK', proceed below...
      }

      // --- Proceed with Google Sign-in ---
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store/update user data in Firestore
      await setDoc(doc(db, USERS_COLLECTION, user.uid), {
        email: user.email,
        name: user.displayName || "",
        isVolunteer, // This will be true if they confirmed
        joinedAt: serverTimestamp(),
        signUpMethod: "google",
      }, { merge: true });

      navigate("/"); // Redirect on successful sign-in/data save
    } catch (err) {
      console.error("Google Sign-in error:", err);
      // Provide a user-friendly error message
      let errorMessage = "Google sign-in failed. Please try again.";
      // Check for specific Firebase errors if needed (e.g., 'auth/popup-closed-by-user')
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = "Google sign-in cancelled.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      // Ensure loading is always stopped, whether success, error, or cancellation
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full p-6 sm:p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
          Create Your Account
        </h2>

        {/* Error Display Area */}
        {error && (
          <p
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm"
            role="alert"
            aria-live="polite" // Announce errors to screen readers
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email-signup"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password-signup"
              type="password"
              required
              minLength={6} // Basic client-side validation hint
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              disabled={loading}
            />
          </div>

          {/* Improved Volunteer Toggle using Checkbox + Label Styling */}
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md border border-gray-200">
            <label htmlFor="volunteer-toggle" className="text-sm text-gray-700 font-medium cursor-pointer select-none">
              I want to sign up as a volunteer
            </label>
            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                id="volunteer-toggle"
                checked={isVolunteer}
                onChange={() => setIsVolunteer(!isVolunteer)}
                disabled={loading}
                // Screen reader only class to hide the default checkbox,
                // but keep it accessible
                className="sr-only peer"
              />
              {/* Styled Label acts as the switch track and thumb */}
              <label
                htmlFor="volunteer-toggle"
                className={`
                  block overflow-hidden h-7 w-12 rounded-full cursor-pointer
                  ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 peer-checked:bg-emerald-600'}
                  transition-colors duration-300 ease-in-out
                `}
              >
                {/* The "thumb" */}
                <span
                  className={`
                    absolute left-1 top-1 block h-5 w-5 rounded-full bg-white shadow
                    transform transition-transform duration-300 ease-in-out
                    ${isVolunteer ? 'translate-x-5' : 'translate-x-0'}
                  `}
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>


          {/* Email Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up with Email'}
          </button>

          {/* Divider */}
          <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google icon"
              className="w-5 h-5"
            />
            <span>{loading ? 'Processing...' : 'Sign up with Google'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}