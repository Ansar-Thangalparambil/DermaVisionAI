import { useContext } from "react";
import { bookingContext } from "../context/booking";

export const UseBook = () => {
  const context = useContext(bookingContext);
  if (!context) {
    throw new Error("UseBook must be used within a BookingProvider");
  }
  return context;
};
