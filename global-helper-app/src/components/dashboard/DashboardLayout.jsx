// src/components/dashboard/DashboardLayout.jsx
import { useState } from "react";
import { ArrowPathIcon, CheckCircleIcon, StarIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

import ProfileCard from "./ProfileCard";
import StatCard from "./StatCard";
import TaskManager from "./TaskManager";
import TopSuggestions from "./TopSuggestions";
import ActivityTimeline from "./ActivityTimeline";
import TaskDetailsModal from "./TaskDetailsModal"; // <-- import

export default function DashboardLayout({ user, isVolunteer, myStats, myTasks }) {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!user || !myStats || !myTasks) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ArrowPathIcon className="h-8 w-8 text-gray-500 animate-spin mx-auto mb-2" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const pointsLabel     = isVolunteer ? "Points Earned"   : "Points Spent";
  const tasksLabel      = isVolunteer ? "Tasks Helped With" : "Your Requests";
  const suggestionsTitle = isVolunteer ? "Tasks You Might Like" : "Get Help Faster";

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Profile */}
        <ProfileCard user={user} />

        {/* 2. Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Tasks Completed" value={myStats.completed} icon={<CheckCircleIcon className="text-green-500" />} />
          <StatCard label={pointsLabel}      value={myStats.points}    icon={<StarIcon        className="text-yellow-500" />} />
          <StatCard label={tasksLabel}       value={myStats.total}     icon={<ClipboardDocumentListIcon className="text-blue-500" />} />
        </div>

        {/* 3. Task Manager */}
        <TaskManager
          userId={user.uid}
          isVolunteer={isVolunteer}
          onViewDetails={(task) => setSelectedTask(task)}
        />

        {/* 4. Suggestions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{suggestionsTitle}</h2>
          <TopSuggestions isVolunteer={isVolunteer} />
        </div>

        {/* 5. Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <ActivityTimeline
            activity={myTasks.activity}
            onViewDetails={(task) => setSelectedTask(task)}
          />
        </div>
      </div>

      {/* GLOBAL Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
