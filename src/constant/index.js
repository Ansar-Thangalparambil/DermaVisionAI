import { TbLayoutDashboardFilled } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { FaUserDoctor } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa6";
import { RiFeedbackFill } from "react-icons/ri";

export const SIDE_BAR_ITEMS = [
  {
    title: "Dashboard",
    id: 1,
    icon: TbLayoutDashboardFilled,
    path: "/",
  },
  {
    title: "Users",
    id: 2,
    icon: LuUsers,
    path: "/users",
  },
  {
    title: "Dermatologist",
    id: 3,
    icon: FaUserDoctor,
    path: "/doctor",
  },
  // {
  //   title: "Specialties",
  //   id: 4,
  //   icon: FaClipboardList,
  //   path: "/specialist",
  // },
  {
    title: "Feedback",
    id: 5,
    icon: RiFeedbackFill,
    path: "/feedback",
  },
];
