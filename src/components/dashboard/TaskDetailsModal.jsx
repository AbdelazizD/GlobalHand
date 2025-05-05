import { XCircleIcon } from "@heroicons/react/24/outline";

export default function TaskDetailsModal({ task, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <XCircleIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Date:</span> {task.date}</p>
          <p><span className="font-medium">Time:</span> {task.time}</p>
          <p><span className="font-medium">Location:</span> {task.location || (task.isOnline ? "Online" : "N/A")}</p>
          <p><span className="font-medium">Status:</span> {task.status}</p>
          <p><span className="font-medium">Posted by:</span> {task.userId}</p>
        </div>

        {task.mediaURLs?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-1">Media:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-600 underline">
              {task.mediaURLs.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    View File {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
