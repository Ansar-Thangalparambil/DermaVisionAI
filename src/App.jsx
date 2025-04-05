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
import Users from "./pages/Users";
import UserDetails from "./pages/userDetails";
import DoctorProfilePage from "./pages/doctorDetail";
import Specialist from "./pages/specialist";
import DermatologistRegister from "./pages/dermatologistRegister";
import DermoLayout from "./layouts/DermoLayout";
import DermoHome from "./pages/DermoHome";
import DermoLogin from "./pages/dermoLogin";
import ScheduleConsult from "./components/ScheduleConsult";
import { ProtectedRouteForDermoLayout } from "./components/ProtectDermoLayout";
import { ProtectedRouteForUserLayout } from "./components/protectedRouteForUser";
import RecentAppointments from "./components/RecentAppointments";
import Complaints from "./pages/complaints";
import { ProtectedRouteForDashboard } from "./components/ProtectedRouteForDashboard";
import Feedback from "./pages/notification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRouteForUserLayout>
              <HomeLayout />
            </ProtectedRouteForUserLayout>
          }
        >
          <Route index element={<Home />} />
          <Route path="notification" element={<Notification />} />
          <Route path="slot/:doctorId" element={<SlotBooking />} />
          <Route path="category/:categoryName" element={<CategoryResult />} />
          <Route path="doctors/:doctorId" element={<DoctoryDetail />} />
          <Route path="appointments" element={<RecentAppointments />} />
          <Route path="help" element={<Complaints />} />
          <Route path="result" element={<AIResult />} />
          <Route
            path="appointments/:appId"
            element={<AppointmentDetailPage />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRouteForDashboard>
              <DashboardLayout />
            </ProtectedRouteForDashboard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<UserDetails />} />
          <Route path="doctor" element={<Appointments />} />
          <Route
            path="doctor/:doctorId"
            element={<DoctorProfilePage admin={true} />}
          />
          <Route path="specialist" element={<Specialist />} />
          <Route path="notification" element={<Notification />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        {/* <Route path="/dermotolgist" element={<DermatologistRegister />} /> */}
        <Route
          path="/dermotolgist"
          element={
            <ProtectedRouteForDermoLayout>
              <DermoLayout />
            </ProtectedRouteForDermoLayout>
          }
        >
          <Route index element={<DermoHome />} />
          <Route path="notification" element={<Notification />} />
          <Route path="appointments" element={<Appointments />} />
          <Route
            path="schedule-consult/:bookingId"
            element={<ScheduleConsult />}
          />
        </Route>
        <Route path="/dermoRegister" element={<DermatologistRegister />} />
        <Route path="/dermoLogin" element={<DermoLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
