import React, { useEffect, useState } from "react";

const Notification = () => {
  const [selected, setSelected] = useState("Latest");
  const data = {
    latest: [
      {
        name: "Dr. Aakash Mehta",
        confirmed:
          "Your appointment is confirmed for March 5, 2025, at 10:30 AM.",
        sendDate: "2 mins ago",
        image: "",
      },
      {
        name: "Dr. Aakash Mehta",
        confirmed:
          "Your appointment is confirmed for March 5, 2025, at 10:30 AM.",
        sendDate: "2 mins ago",
        image: "",
      },
    ],
    seen: [
      {
        name: "Dr. Aakash Mehta ",
        confirmed:
          "Your appointment is confirmed for March 5, 2025, at 10:30 AM.",
        sendDate: "2 mins ago",
        image: "",
      },
      {
        name: "Dr. Aakash Mehta",
        confirmed:
          "Your appointment is confirmed for March 5, 2025, at 10:30 AM.",
        sendDate: "2 mins ago",
        image: "",
      },
      {
        name: "Dr. Aakash Mehta",
        confirmed:
          "Your appointment is confirmed for March 5, 2025, at 10:30 AM.",
        sendDate: "2 mins ago",
        image: "",
      },
      {
        name: "Dr. Aakash Mehta",
        confirmed:
          "Your appointment is confirmed for March 5, 2025, at 10:30 AM.",
        sendDate: "2 mins ago",
        image: "",
      },
    ],
  };
  const [filterd, setFiltered] = useState(data?.latest);
  useEffect(() => {
    setFiltered((prev) => {
      if (selected === "Latest") {
        return data.latest;
      } else {
        return data.seen;
      }
    });
  }, [selected]);
  return (
    <div className="px-4 md:px-12 flex flex-col   ">
      <h1 className="text-2xl font-medium my-4">Notifications</h1>

      <div className="flex border-b gap-x-5 mt-5 border-[#DDDDDD] space-x-4 mb-2">
        {["Latest", "Seen"].map((item) => (
          <div
            onClick={() => setSelected(item)}
            className={` cursor-pointer items-center  flex gap-x-2 ${
              selected === `${item}` && `border-b-2 border-green-500`
            } `}
          >
            <button
              className={`pb-2 font-medium  ${
                selected === `${item}` ? `text-black` : `text-[#33333366]`
              }  `}
            >
              {item}
            </button>
            {selected === `${item}` && `border-b-2 border-green-500` && (
              <span className=" bg-red-500 -translate-y-1 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                2
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col mt-6">
        {filterd.map((_, index) => (
          <div
            key={index}
            className={`h-[96px] ${
              selected === "Latest" ? `bg-[#F7FFFF]` : `bg-[#F7F7F7]`
            }  border-b cursor-pointer
                 border-[#DDDDDD] p-5 flex  justify-between`}
          >
            <div className="flex  gap-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src="/doctor.jpeg" alt="" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-medium">Dr. Aakash Mehta</h4>
                <span className="text-sm text-[#333333CC]/80 mt-3 font-light">
                  Your appointment is confirmed for March 5, 2025, at 10:30 AM.
                </span>
              </div>
            </div>
            <span className="text-xs font-medium h-fit text-[#299392] items-center flex gap-x-2">
              <img src="/icons/clock.svg" alt="" className="w-4" /> 2 mins ago
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
