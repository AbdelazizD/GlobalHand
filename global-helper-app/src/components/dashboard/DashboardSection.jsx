import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import StatCard from "./StatCard";
import TaskManager from "./TaskManager";
import TopSuggestions from "./TopSuggestions";
import ActivityTimeline from "./ActivityTimeline";

// --- DashboardSection Component ---
function DashboardSection({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}

// --- EditInput Component for Profile Edit ---
function EditInput({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          {...props}
        />
      </div>
    </div>
  );
}

// --- DashboardLayout Component ---
export default function DashboardLayout({ user, isVolunteer, myStats, myTasks }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
  });

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (updatedData) => {
    console.log("Attempting to save profile:", updatedData);
    // Add backend call logic here
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    handleProfileUpdate(profileFormData);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      photoURL: user?.photoURL || '',
    });
  };

  const pointsLabel = isVolunteer ? "Points Earned" : "Points Spent";
  const tasksLabel = isVolunteer ? "Tasks Helped With" : "Your Requests";
  const suggestionsTitle = isVolunteer ? "Tasks You Might Like" : "Get Help Faster";
  const tasksTitle = isVolunteer ? "Your Assigned Tasks" : "My Task Requests";

  // Ensure data is available
  if (!user || !myStats || !myTasks) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Profile Section --- */}
        <DashboardSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditingProfile ? 'Edit Profile' : 'Your Profile'}
            </h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
                aria-label="Edit profile"
              >
                <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </div>

          <div>
            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  {profileFormData.photoURL ? (
                    <img className="h-12 w-12 rounded-full object-cover" src={profileFormData.photoURL} alt="Profile" />
                  ) : (
                    <UserCircleIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-base font-medium text-gray-800">{profileFormData.displayName || "Not set"}</p>
                    <p className="text-sm text-gray-600">{profileFormData.email || "Not set"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="flex items-center space-x-3">
                  {profileFormData.photoURL ? (
                    <img className="h-16 w-16 rounded-full object-cover" src={profileFormData.photoURL} alt="Current profile" />
                  ) : (
                    <UserCircleIcon className="h-16 w-16 text-gray-400" aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    className="ml-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled
                  >
                    Change Picture
                  </button>
                </div>

                <EditInput
                  label="Name"
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={profileFormData.displayName}
                  onChange={handleProfileInputChange}
                  required
                />

                <EditInput
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={handleProfileInputChange}
                  readOnly
                  className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleProfileCancel}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </DashboardSection>

        {/* --- Pending Requests Section --- */}
        <DashboardSection title="Pending Requests">
          {myTasks && myTasks.filter(task => task.status === 'pending').map((task) => (
            <div key={task.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-4">
              <div>
                <p className="text-lg font-medium">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <button
                onClick={() => cancelTask(task.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          ))}
        </DashboardSection>

        {/* --- Stats Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            label="Tasks Completed"
            value={myStats.completed}
            icon={<CheckCircleIcon className="text-green-500" />}
          />
          <StatCard
            label={pointsLabel}
            value={myStats.points}
            icon={<StarIcon className="text-yellow-500" />}
          />
          <StatCard
            label={tasksLabel}
            value={myStats.total}
            icon={<ClipboardDocumentListIcon className="text-blue-500" />}
          />
        </div>

        {/* --- Other Sections (Suggestions, Tasks, Activity) --- */}
        <DashboardSection title={suggestionsTitle}>
          <TopSuggestions isVolunteer={isVolunteer} />
        </DashboardSection>

        <DashboardSection title={tasksTitle}>
          <TaskManager tasks={myTasks} isVolunteer={isVolunteer} />
        </DashboardSection>

        <DashboardSection title="Recent Activity">
          {user?.uid && <ActivityTimeline userId={user.uid} />}
        </DashboardSection>
      </div>
    </div>
  );
}
