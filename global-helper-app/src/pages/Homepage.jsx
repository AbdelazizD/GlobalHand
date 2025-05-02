// src/pages/Homepage.jsx
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Homepage() {
  const { isAuthenticated, loading} = useAuth();
  const navigate = useNavigate();

  const handleRequestClick = () => {
    if (loading) return;            // 🛑 wait until we know
    if (isAuthenticated) {
      navigate("/request");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="space-y-24">

      {/* Hero Section */}
      <section className="bg-sky-100 py-20 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Connecting Help with Hope – Globally.
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          Post a request or offer support where it’s needed most, for free.
        </p>
        <div className="space-x-4">
          <button
            onClick={handleRequestClick}
            className="bg-emerald-600 text-white py-2 px-6 rounded hover:bg-emerald-700"
          >
            Request Help
          </button>
          <Link
            to="/signup"
            className="border border-emerald-500 text-emerald-600 px-6 py-2 rounded hover:bg-emerald-50"
          >
            Join as Volunteer
          </Link>
        </div>
      </section>
            {/* 🌍 Active Regions */}
            <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Focus Regions
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Kindred currently prioritizes support for individuals and communities in areas facing significant challenges and crises.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6 text-center">
          {["Gaza", "Syria", "Sudan", "Yemen", "Ukraine", "Afghanistan"].map((region) => (
            <div
              key={region}
              className={`
                p-4 bg-white shadow rounded-lg transition-shadow duration-200 ease-in-out
                text-gray-700 font-medium text-sm sm:text-base
                relative overflow-visible
                ${region === 'Gaza'
                  ? 'gaza-trail-effect border border-red-200'
                  : 'hover:shadow-md hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'}
              `}
            >
              {region}              
            </div>
          ))}
        </div>
      </section>

      {/* 💖 Leaderboard */}
      <section className="bg-white py-16 px-4 shadow-inner">
        <h2 className="text-2xl font-semibold text-center mb-6">💖 Top Volunteers</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{ name: "Omar", points: 125 }, { name: "Amina", points: 109 }, { name: "Ali", points: 98 }].map(
            (user, idx) => (
              <div key={idx} className="border p-4 rounded shadow text-center">
                <p className="text-lg font-bold">{user.name}</p>
                <p className="text-emerald-600 text-xl">{user.points} pts</p>
                <p className="text-sm text-gray-500">Compassion Points</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* 📦 How it Works */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">📦 How it Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white shadow rounded">
            <p className="text-3xl mb-2">1️⃣</p>
            <h3 className="font-bold mb-1">Post a Request</h3>
            <p className="text-gray-600 text-sm">Briefly describe what kind of help you need.</p>
          </div>
          <div className="p-6 bg-white shadow rounded">
            <p className="text-3xl mb-2">2️⃣</p>
            <h3 className="font-bold mb-1">Get Connected</h3>
            <p className="text-gray-600 text-sm">A volunteer sees your request and offers assistance.</p>
          </div>
          <div className="p-6 bg-white shadow rounded">
            <p className="text-3xl mb-2">3️⃣</p>
            <h3 className="font-bold mb-1">Give Feedback</h3>
            <p className="text-gray-600 text-sm">Rate the help you received with 1–5 compassion points.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
