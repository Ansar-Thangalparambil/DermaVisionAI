import React from "react";

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    {
      title: "Total Appointments",
      value: "120",
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Today Appointments",
      value: "6",
      icon: "🛒",
      color: "bg-green-500",
    },
    {
      title: "Pending Request",
      value: "$456",
      icon: "💬",
      color: "bg-yellow-500",
    },
    {
      title: "Declined Appointments",
      value: "4",
      icon: "📦",
      color: "bg-red-500",
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
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <h1 className="text-xl font-medium mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 py-6 flex items-center"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white mr-4`}
            >
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-gray-600">{stat.title}</p>
              <p className="text-2xl font-light">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Requests */}
        <div className="lg:col-span-2">
          <div className=" rounded-lg ">
            <div className="flex justify-between items-center p-4 ">
              <h2 className="text-lg font-medium">Appointment Requests</h2>
              <button className="text-blue-500 hover:underline">See All</button>
            </div>
            <div className="overflow-x-auto border  border-[#EEEEEE] rounded-xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EEEEEE] bg-gray-50">
                    <th className="p-3 pl-6 text-left font-normal text-[#808080]">
                      Name
                    </th>
                    <th className="p-3 text-left font-normal text-[#808080]">
                      Date
                    </th>
                    <th className="p-3 text-left font-normal text-[#808080]">
                      Time
                    </th>
                    <th className="p-3 text-left font-normal text-[#808080]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentRequests.map((appointment, index) => (
                    <tr
                      key={index}
                      className="border-b font-light border-[#EEEEEE] hover:bg-gray-50"
                    >
                      <td className="p-3 pl-6">{appointment.name}</td>
                      <td className="p-3">{appointment.date}</td>
                      <td className="p-3">{appointment.time}</td>
                      <td className="p-3 truncate max-w-xs">
                        {appointment.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="lg:col-span-1">
          <div className=" rounded-lg ">
            <div className="p-4 ">
              <h2 className="text-lg font-medium">Upcoming</h2>
            </div>
            <div className="border border-[#EEEEEE]   rounded-xl ">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b px-6 border-[#EEEEEE]  items-center p-3 hover:bg-gray-50"
                >
                  <div className="">
                    <p>{appointment.name}</p>
                    <p className="text-gray-500 text-sm">{appointment.time}</p>
                  </div>
                  <button
                    className={`px-3 text-sm py-2 rounded-2xl text-white ${
                      appointment.status === "primary"
                        ? "bg-teal-500"
                        : "bg-gray-500"
                    }`}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
