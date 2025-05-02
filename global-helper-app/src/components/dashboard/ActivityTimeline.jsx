import { useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function ActivityTimeline({ activity }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleViewDetails = async (item) => {
    if (item.task) {
      // Task is already present in activity
      setSelectedTask(item.task);
    } else if (item.taskId) {
      try {
        setLoading(true);
        const taskDoc = await getDoc(doc(db, "requests", item.taskId));
        if (taskDoc.exists()) {
          setSelectedTask({ id: taskDoc.id, ...taskDoc.data() });
        } else {
          console.warn("No such task found.");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!Array.isArray(activity)) return <div>No activity available</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-medium mb-2">Recent Activity</h2>
      {activity.length === 0 ? (
        <p className="text-gray-600">No recent activity.</p>
      ) : (
        <ul className="space-y-3">
          {activity.map((item, index) => (
            <li
              key={index}
              className="bg-white p-3 rounded shadow border text-sm flex justify-between items-center"
            >
              <div>
                <span className="text-emerald-600 font-medium">{item.userName}</span> {item.action}
                <span className="text-gray-500"> • {item.time}</span>
              </div>
              {(item.task || item.taskId) && (
                <button
                  onClick={() => handleViewDetails(item)}
                  className="text-blue-600 text-xs underline hover:text-blue-800"
                >
                  {loading ? "Loading..." : "View Details"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
