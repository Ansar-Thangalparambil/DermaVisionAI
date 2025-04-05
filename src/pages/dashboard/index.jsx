import React from "react";
import StatCard from "../../components/StatCard";
import UsersList from "../../components/UsersList";
import FeedbackList from "../../components/FeedbackList";

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    {
      title: "Total Appointments",
      value: "120",
      icon: "/users.svg",
      color: "bg-[#FAC67A33]",
    },
    {
      title: "Active Today",
      value: "487",
      icon: "/activeToday.svg",
      color: "bg-[#FAD0C433]",
    },
    {
      title: "New This Week",
      value: "128",
      icon: "/newThisWeek.svg",
      color: "bg-[#EABDE633]",
    },
  ];

  const appointmentRequests = [
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
    {
      name: "Sarath",
      date: "26/07/2025",
      time: "11:30am",
      description: "Dr. Aakash Mehta is a highly experienced orthop...",
    },
  ];

  const upcomingAppointments = [
    { name: "Sarath", time: "11:30am", status: "primary" },
    { name: "Sarath", time: "11:30am", status: "secondary" },
    { name: "Sarath", time: "11:30am", status: "secondary" },
    { name: "Sarath", time: "11:30am", status: "secondary" },
    { name: "Sarath", time: "11:30am", status: "secondary" },
    { name: "Sarath", time: "11:30am", status: "secondary" },
    { name: "Sarath", time: "11:30am", status: "secondary" },
  ];

  return (
    <div className=" bg-gray-50 h-full overflow-y-auto">
      {/* Stats Cards */}
      {/* <StatCard stats={stats} /> */}

      {/* users List   */}
      <UsersList />
      {/* feed back list  */}
      {/* <FeedbackList /> */}
    </div>
  );
};

export default Dashboard;
