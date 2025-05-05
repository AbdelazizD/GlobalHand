// src/components/dashboard/TaskManager.jsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  ClipboardDocumentListIcon,
  PencilIcon,
  XCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

// Status → Tailwind classes
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "assigned":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TaskManager({ userId, isVolunteer, onViewDetails, onEdit }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const colRef = collection(db, "requests");
      const q = isVolunteer
        ? query(colRef, where("assignedVolunteerId", "==", userId))
        : query(colRef, where("userId", "==", userId));
      const snap = await getDocs(q);
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, [userId, isVolunteer]);

  const activeTasks    = tasks.filter(t => t.status !== "cancelled");
  const cancelledTasks = tasks.filter(t => t.status === "cancelled");
  const title = isVolunteer ? "Tasks You're Helping With" : "Your Posted Requests";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>

      {/* Active Tasks */}
      <div className="p-6 space-y-4">
        {activeTasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No active tasks found.
          </p>
        ) : (
          activeTasks.map((task) => {
            const statusKey = (task.status || "pending").toLowerCase();
            const statusClasses = getStatusStyles(statusKey);

            return (
              <div
                key={task.id}
                className="border dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {task.title || "Untitled Task"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {task.location || (task.isOnline ? "Online" : "—")} •{" "}
                      {task.date ? new Date(task.date).toLocaleDateString() : "No Date"}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusClasses}`}
                  >
                    {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                  </span>
                </div>

                {/* Bottom Actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 flex justify-end items-center gap-4">
                  {isVolunteer ? (
                    <button className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors">
                      <CheckCircleIcon className="h-4 w-4" />
                      Mark Complete
                    </button>
                  ) : (
                    <>
                      <button onClick={() => onEdit(task)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">
                        <XCircleIcon className="h-4 w-4" />
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onViewDetails(task)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cancelled Tasks History */}
      {cancelledTasks.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
            Cancelled Requests (History)
          </h3>
          <ul className="space-y-3">
            {cancelledTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {task.title}
                  </p>
                </div>
                <button
                  onClick={() => onViewDetails(task)}
                  className="text-blue-600 dark:text-blue-400 text-xs hover:underline font-medium"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
