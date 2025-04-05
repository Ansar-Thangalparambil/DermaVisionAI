import React from "react";

const BookingHistory = ({ title }) => {
  return (
    <div className="bg-white mt-8 flex flex-col rounded-[14px]">
      <div className="flex items-center justify-between p-5">
        <h4 className="text-2xl font-semibold">{title}</h4>
        <div
          className="border border-[#ABABAB]/50 cursor-pointer rounded-lg flex 
    items-center text-sm justify-center gap-x-2 p-[10px] "
        >
          Happy
          <img src="/icons/arrowDown.svg" className="w-3" alt="" />
        </div>
      </div>
      <table>
        <thead className="bg-[#EEEEEE] text-[#B3B3B3] text-sm ">
          <th className="font-medium py-4 text-left pl-5">DOCTOR</th>
          <th className="font-medium py-4 text-center">DATE & TIME</th>
          <th className="font-medium py-4 text-left pl-5">FEEDBACK</th>
          <th className="font-medium py-4 text-center">RATING</th>
        </thead>
        <tbody>
          {new Array(4).fill(" ").map((_, index) => (
            <tr key={index} className="border-b border-[#EEEEEE]">
              <td className="py-4 pl-5 flex items-center justify-start font-light">
                <div className="flex flex-col gap-y-1">
                  <span>Dr. Aakash Mehta</span>
                  <span className="text-sm  text-[#B3B3B3]">
                    {" "}
                    emma137@gmail.com
                  </span>
                </div>
              </td>
              <td className="text-center align-top text-[#B3B3B3]  py-3 text-sm font-light ">
                Jan 15, 2025
              </td>

              <td className="text-left font-light pl-5 max-w-sm leading-7 py-3 text-[#B3B3B3] text-sm">
                The doctor booking process was smooth and easy to use. I found a
                doctor quickly, and the appointment confirmation was fast.
                However, it would be great if there were more payment options
                and real-time consultation availability updates. Overall, a good
                experience!
              </td>
              <td className="font-light align-top py-4  text-[#B3B3B3] text-sm">
                <div className="flex items-center justify-center">
                  <img src="/icons/rating.svg" alt="" />
                  <img src="/icons/rating.svg" alt="" />
                  <img src="/icons/rating.svg" alt="" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between p-5">
        <h4 className=" font-medium w-fit whitespace-nowrap">
          2,543 User Results
        </h4>
        <div className="  w-full gap-x-1 flex items-center justify-end">
          <button
            className="py-[9px] px-[19px] border-2 border-[#B3B3B3]/30  cursor-pointer
hover:bg-[#1E6F6D] hover:text-white text-[#B3B3B3] text-sm rounded-lg"
          >
            Previous
          </button>
          {[1, 2, 3, 4].map((item, index) => (
            <button
              key={index}
              className="py-[9px] px-[19px] border-2 border-[#B3B3B3]/30  cursor-pointer
hover:bg-[#1E6F6D] hover:text-white text-[#B3B3B3] text-sm rounded-lg"
            >
              {item}
            </button>
          ))}
          <button
            className="py-[9px] px-[19px] border-2 border-[#B3B3B3]/30  cursor-pointer
hover:bg-[#1E6F6D] hover:text-white text-[#B3B3B3] text-sm rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
