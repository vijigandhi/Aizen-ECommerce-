// Banner.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Banner = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
  };

  return (
    <div className="w-full h-[60vh] flex justify-center items-center pt-3">
      <div className="w-full max-w-7xl h-full rounded-lg overflow-hidden"> 
        <Slider {...settings} className="w-full h-full">
          {images.map((image, index) => (
            <div key={index} className="w-full h-full">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Banner;
