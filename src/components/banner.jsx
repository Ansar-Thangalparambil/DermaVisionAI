import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (_, next) => setActiveSlide(next),
    customPaging: (i) => (
      <button
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          activeSlide === i ? "bg-teal-500 scale-110" : "bg-gray-300"
        }`}
      ></button>
    ),
    dotsClass: "slick-dots flex justify-center items-center gap-2 mt-4",
  };

  const slides = [
    {
      id: 1,
      image: "/banner1.png",
      alt: "Healthcare Services Banner 1",
    },
    {
      id: 2,
      image: "/banner2.png",
      alt: "Healthcare Services Banner 2",
    },
    {
      id: 3,
      image: "/banner3.png",
      alt: "Healthcare Services Banner 3",
    },
  ];

  return (
    <div className=" px-4">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="outline-none">
            <div className="relative rounded-xl min-h-[400px] md:min-h-[500px] overflow-hidden">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
