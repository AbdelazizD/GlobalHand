import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Flag from "react-world-flags";

export default function TaskCard({ task, onClick }) {
  const points = typeof task.points === "number" ? task.points : 1;
  const hearts = Array.from({ length: points });

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-lg transition duration-300 cursor-pointer bg-white hover:shadow-lg hover:-translate-y-1
        ${task.completed ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${points >= 4 ? 'glow-effect' : ''}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={task.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-emerald-500 mr-2"
        />
        <div className="flex space-x-1">
          {hearts.map((_, i) => (
            <FaHeart key={i} className="text-emerald-500" />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
        {task.description || "No description provided."}
      </p>

      <div className="flex items-center text-xs text-gray-500">
        <Flag
          code={task.countryCode || "AU"}
          style={{ width: 20, height: 14, borderRadius: 2 }}
        />
        <span className="ml-2">{task.location || "Unknown"}</span>
        <FaMapMarkerAlt className="ml-1" />
      </div>
    </div>
  );
}
