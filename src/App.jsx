import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Home from "./pages/home";
import HomeLayout from "./layouts/HomeLayout";
import Notification from "./pages/notification";
import SlotBooking from "./pages/slote";
import CategoryResult from "./pages/categoryRestult";
import DoctoryDetail from "./pages/doctorDetail";
import Appointments from "./pages/appointments";
import AppointmentDetailPage from "./pages/appointmentDetail";
import AIResult from "./pages/aiResult";
import Dashboard from "./pages/dashboard";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="notification" element={<Notification />} />
          <Route path="slot" element={<SlotBooking />} />
          <Route path="category/:categoryName" element={<CategoryResult />} />
          <Route path="doctors/:doctorName" element={<DoctoryDetail />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="result" element={<AIResult />} />
          <Route
            path="appointments/:appId"
            element={<AppointmentDetailPage />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="notification" element={<Notification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
