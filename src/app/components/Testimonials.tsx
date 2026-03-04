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
  avatar?: string;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Viv Bunny",
    rating: 5,
    text: "Stunning views and a beautifully designed home that made the most of the site. The home is very luxurious and our group loved the indoor outdoor flow, the heated pool and all the modern conveniences. The furniture was tasteful and beds very comfortable. It was sited on a very quiet street - A great place to stay when visiting Taupo.",
    date: "3 months ago",
  },
  {
    id: "2",
    author: "Nina Pineaha",
    rating: 5,
    text: "This home was absolutely breathtaking. It was the perfect place to celebrate my 40th birthday with my whānau. We loved our stay and wish we could've stayed longer. This place really does have everything. Heated pool, sauna, spa, lake view...",
    date: "4 months ago",
  },
  {
    id: "3",
    author: "Luke and Krissy Shadbolt",
    rating: 5,
    text: "This place is absolute perfection. Immaculately clean, absolutely modern, gorgeous decor, every single appliance you can think of. The views are breathtaking, neighbourhood is quiet, town is a 5 minute drive away. I would totally recommend.",
    date: "5 months ago",
  },
  {
    id: "4",
    author: "Hiral Patel",
    rating: 5,
    text: "Super cosy and relaxing get away! We were absolutely blown away by this accommodation. The house is spacious and thoughtfully set up: generous bedrooms with wall-mounted TVs, and three rooms with their own ensuites.",
    date: "3 months ago",
  },
  {
    id: "5",
    author: "Feeny Savage",
    rating: 5,
    text: "100% would recommend. Enough rooms for each of us in the group. Each pretty much had our own bathroom which we all loved. Stunning views. The gym even got used from one of our girls. The heated pool, spa & sauna were definitely a highlight.",
    date: "6 months ago",
  },
  {
    id: "6",
    author: "Alyssa Royal",
    rating: 5,
    text: "Ashleigh & Matt's stay was absolutely wonderful, we went as a big family for a trip for the kids too enjoy for the last week of the holidays, it was amazing & beautiful. The house had a lot of amenities that were really handy, the heated pool was a hit!",
    date: "4 months ago",
  },
];

export function Testimonials() {
  const googleMapsUrl = "https://g.page/r/CZuTLT-YqNStEBM/review";

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    adaptiveHeight: true,
    fade: true,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
  };

  return (
    <section className="py-24 md:py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold text-[#9DA07E] block mb-4">Guest Experience</span>
            <h2 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight">
              A Stay Worth <br />
              <span className="italic">Remembering</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#9DA07E" className="text-[#9DA07E]" />
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <p className="text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">Live Sync: Google Maps</p>
            </div>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-slate-900 font-bold text-[10px] md:text-xs uppercase tracking-widest hover:text-[#9DA07E] transition-colors"
            >
              View all Google Reviews <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="testimonial-carousel-container relative">
          <Slider {...settings}>
            {REVIEWS.map((review) => (
              <div key={review.id} className="pb-12 outline-none">
                <motion.div
                  className="bg-slate-50 p-8 md:p-16 rounded-[40px] border border-slate-100 relative group flex flex-col items-center text-center"
                >
                  <div className="mb-10 opacity-10">
                    <Quote size={60} fill="#9DA07E" />
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 mb-8">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#9DA07E" className="text-[#9DA07E]" />
                    ))}
                  </div>
                  
                  <p className="text-slate-700 text-lg md:text-2xl font-light leading-relaxed mb-12 italic max-w-2xl">"{review.text}"</p>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#9DA07E]/10 flex items-center justify-center text-[#9DA07E] font-bold text-lg border-2 border-white shadow-sm">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-slate-900">{review.author}</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{review.date}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
          <style>{`
            .testimonial-carousel-container .slick-dots { bottom: -20px; }
            .testimonial-carousel-container .slick-dots li button:before { color: #9DA07E; font-size: 8px; }
            .testimonial-carousel-container .slick-dots li.slick-active button:before { color: #1a1c16; }
            .testimonial-carousel-container .slick-list { overflow: visible; }
          `}</style>
        </div>
      </div>
    </section>
  );
}