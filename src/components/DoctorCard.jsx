const DoctorCard = () => (
  <div className="py-5 px-4 shadow-md border border-gray-100 flex-col rounded-lg flex">
    <div className="flex gap-x-3">
      <div className="w-20 h-20 overflow-hidden rounded-lg">
        <img
          src="/doctor.jpeg"
          alt="Doctor"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1.5">
        <h4 className="font-medium">Dr. Aswin Mananath</h4>
        <div className="flex items-center gap-x-2">
          <img src="/icons/dr.svg" alt="Specialty" />
          <span className="text-sm text-gray-500 font-medium">
            General Physician
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="font-medium">3.6</span>
          <div className="flex gap-x-1 items-center">
            {[1, 2, 3].map((i) => (
              <img key={i} src="/icons/star.svg" alt="Star" />
            ))}
            <img src="/icons/rate.svg" alt="Empty star" />
          </div>
        </div>
      </div>
    </div>
    <span className="mt-4 font-medium text-green-600 text-sm">
      Available Now
    </span>
  </div>
);

export default DoctorCard;
