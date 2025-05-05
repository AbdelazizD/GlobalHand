// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { db, collection, query, where, getDocs } from "../firebase";
import { useAuth } from "@/hooks/useAuth"; // this automatically resolves .js
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Dashboard() {
  const { user, isVolunteer, loading: authLoading } = useAuth() || { user: null, isVolunteer: false, loading: true };
  const [myStats, setMyStats] = useState({ completed: 0, points: 0, total: 0 });
  const [myTasks, setMyTasks] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading && !user) setDataLoading(false);
      return;
    }

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const q = query(collection(db, "requests"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setMyTasks(tasks);
        const completed = tasks.filter(t => t.status === "completed").length;
        const points = tasks.reduce((sum, task) => sum + (task.pointsAwarded || task.pointsValue || 0), 0);

        setMyStats({ completed, total: tasks.length, points });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, isVolunteer, authLoading]);

  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gray-100">
        <div className="text-center text-gray-600">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 p-6 bg-gray-100">
        Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to view your dashboard.
      </div>
    );
  }

  return (
    <DashboardLayout user={user} isVolunteer={isVolunteer} myStats={myStats} myTasks={myTasks} />
  );
}
