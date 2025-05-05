import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import TaskCard from "@/components/TaskCard";
import TaskDetailsDrawer from "@/components/TaskDetailsDrawer";
import MapWithMarkers from "@/components/MapWithMarkers"; // Assuming this component exists

export default function BrowseTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, "requests"));
                const taskList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTasks(taskList);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <p className="text-center text-gray-500 text-lg">Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-50">
            {/* Left Panel: Task List */}
            <div className="w-full md:w-1/3 lg:max-w-md flex-shrink-0 p-4 overflow-y-auto border-r border-gray-200 bg-white shadow-sm">
                <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-800 sticky top-0 bg-white pb-2 z-10">
                    Available Tasks
                </h2>
                <div className="space-y-3">
                    {tasks.length === 0 && !loading ? (
                        <p className="text-gray-500">No tasks available right now.</p>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={() => setSelectedTask(task)}
                                isSelected={selectedTask?.id === task.id}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Either Map or Drawer */}
            <div className="relative flex-1 overflow-hidden bg-white">
                {/* Map (only shown when no task is selected) */}
                {!selectedTask && (
                    <MapWithMarkers
                        tasks={tasks}
                        selectedTask={selectedTask}
                        onMarkerClick={(task) => setSelectedTask(task)}
                    />
                )}

                {/* Drawer (replaces map when a task is selected) */}
                {selectedTask && (
                    <TaskDetailsDrawer
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        className="absolute inset-0 z-20 bg-white shadow-lg animate-slide-in"
                    />
                )}
            </div>
        </div>
    );
}
