import * as React from "react";
import { Star, Quote, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  highlight?: string;
}

const REVIEWS: Review[] = [
  {
    id: "charles",
    author: "Charles",
    rating: 5,
    text: "The house was incredible, the pool was the perfect temperature even for night swims on a cold evening. Would recommend this to all my friends and family.",
    date: "Verified Guest",
    highlight: "Night swims in heated pool",
  },
  {
    id: "sam",
    author: "Sam",
    rating: 5,
    text: "The house is spacious, clean, and incredibly well appointed. Zero complaints. We had ten guests and never felt on top of each other.",
    date: "Verified Guest",
    highlight: "10 guests, never crowded",
  },
  {
    id: "rajiv",
    author: "Rajiv",
    rating: 5,
    text: "The pool and sauna area made it really hard to leave. The mountain air, the quiet street, and having our own wellness sanctuary right outside the door was unforgettable.",
    date: "Verified Guest",
    highlight: "Pool & sauna sanctuary",
  },
  {
    id: "viv",
    author: "Viv Bunny",
    rating: 5,
    text: "Stunning views and a beautifully designed home that made the most of the site. Our group loved the indoor outdoor flow, the heated pool and all the modern conveniences. Sited on a very quiet street—a great place to stay when visiting Taupō.",
    date: "Google Verified Review",
    highlight: "Indoor-outdoor flow",
  },
  {
    id: "nina",
    author: "Nina Pineaha",
    rating: 5,
    text: "This home was absolutely breathtaking. It was the perfect place to celebrate my 40th birthday with my whānau. We loved our stay and wish we could've stayed longer. Heated pool, sauna, spa, lake view...",
    date: "Google Verified Review",
    highlight: "Celebrated with whānau",
  },
  {
    id: "luke",
    author: "Luke and Krissy Shadbolt",
    rating: 5,
    text: "This place is absolute perfection. Immaculately clean, modern, gorgeous decor, every single appliance you can think of. The views are breathtaking, neighbourhood is quiet, town is a 5 minute drive away.",
    date: "Google Verified Review",
    highlight: "5 mins to town",
  },
];

export function Testimonials() {
  const googleMapsUrl = "https://g.page/r/CZuTLT-YqNStEAE/review";

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5500,
    arrows: false,
    adaptiveHeight: true,
    fade: true,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
  };

  return (
    <section className="py-24 md:py-36 px-6 bg-[#F4F1EA] text-[#203F3A] overflow-hidden border-t border-[#D7C8B4]/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl text-left">
            <span className="text-[11px] uppercase tracking-[0.35em] font-bold text-[#7A5E41] block mb-3">
              56 Reviews · 5.0 Star Rating
            </span>
            <h2 className="text-4xl md:text-7xl font-serif font-light text-[#203F3A] leading-tight">
              A Stay Worth <br />
              <span className="italic font-normal text-[#7A5E41]">Remembering</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-1.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#203F3A" className="text-[#203F3A]" />
              ))}
              <span className="text-sm font-mono font-bold ml-2">5.0 / 5.0</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#203F3A]" />
              <p className="text-[#203F3A]/85 font-semibold text-[10px] uppercase tracking-widest">
                Airbnb Superhost &amp; Google Reviews
              </p>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[#203F3A] font-semibold text-xs uppercase tracking-widest hover:text-[#7A5E41] transition-colors"
            >
              <span>Read All Verified Reviews</span>
              <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        <div className="testimonial-carousel-container relative">
          <Slider {...settings}>
            {REVIEWS.map((review) => (
              <div key={review.id} className="pb-12 outline-none">
                <motion.div className="bg-white p-8 md:p-16 rounded-[40px] border border-[#D7C8B4]/70 shadow-lg relative flex flex-col items-center text-center">
                  <div className="mb-6 text-[#D7C8B4]">
                    <Quote size={48} fill="#D7C8B4" className="mx-auto" />
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#9B7955" className="text-[#7A5E41]" />
                    ))}
                  </div>

                  <p className="text-[#203F3A] text-lg md:text-2xl font-light font-serif leading-relaxed mb-10 italic max-w-3xl">
                    “{review.text}”
                  </p>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#203F3A] text-[#F4F1EA] flex items-center justify-center font-serif text-lg font-medium shadow-md">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-[#203F3A]">{review.author}</h4>
                      <p className="text-[10px] text-[#7A5E41] uppercase tracking-widest font-semibold mt-0.5">
                        {review.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
          <style>{`
            .testimonial-carousel-container .slick-dots { bottom: -20px; }
            .testimonial-carousel-container .slick-dots li button:before { color: #203F3A; font-size: 8px; opacity: 0.3; }
            .testimonial-carousel-container .slick-dots li.slick-active button:before { color: #203F3A; opacity: 1; }
            .testimonial-carousel-container .slick-list { overflow: visible; }
          `}</style>
        </div>
      </div>
    </section>
  );
}
