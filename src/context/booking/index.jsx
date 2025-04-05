import { createContext, useState } from "react";

export const bookingContext = createContext();

export const bookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState();
  const value = {
    bookingData,
    setBookingData,
  };
  return (
    <bookingContext.Provider value={value}>{children}</bookingContext.Provider>
  );
};
