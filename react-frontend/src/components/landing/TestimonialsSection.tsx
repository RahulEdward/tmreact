import { FC, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  profit: string;
  timeframe: string;
}

const TestimonialsSection: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Professional Trader",
      company: "Goldman Sachs",
      content: "TradingMaven's AI algorithms have revolutionized my trading strategy. The predictive analytics are incredibly accurate, and I've seen a 340% increase in my portfolio performance.",
      rating: 5,
      avatar: "👩‍💼",
      profit: "+340%",
      timeframe: "6 months"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Hedge Fund Manager",
      company: "Quantum Capital",
      content: "The lightning-fast execution and real-time analytics have given our fund a significant competitive advantage. We've consistently outperformed the market by 25%.",
      rating: 5,
      avatar: "👨‍💻",
      profit: "+25%",
      timeframe: "Annual"
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Day Trader",
      company: "Independent",
      content: "As a day trader, milliseconds matter. TradingMaven's ultra-low latency execution has helped me capture opportunities I would have missed with other platforms.",
      rating: 5,
      avatar: "👩‍🚀",
      profit: "+180%",
      timeframe: "3 months"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Crypto Investor",
      company: "BlockChain Ventures",
      content: "The security features and multi-asset support make this the perfect platform for crypto trading. The AI insights have been game-changing for our investment decisions.",
      rating: 5,
      avatar: "👨‍🔬",
      profit: "+420%",
      timeframe: "1 year"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Portfolio Manager",
      company: "Wealth Management Inc",
      content: "Managing multiple client portfolios has never been easier. The automated features and comprehensive analytics save me hours every day while improving returns.",
      rating: 5,
      avatar: "👩‍💼",
      profit: "+15%",
      timeframe: "Consistent"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-purple-900/20 to-slate-900/50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-6 py-2 backdrop-blur-sm mb-6"
          >
            <Quote className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Success Stories</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              What Our Traders
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join thousands of successful traders who have transformed their trading 
            experience and achieved remarkable results with our platform.
          </p>
        </motion.div>

        {/* Main testimonial carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative mb-16"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar and stats */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto md:mx-0">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">
                      {testimonials[currentIndex].profit}
                    </span>
                  </div>
                  <p className="text-sm text-green-300">
                    {testimonials[currentIndex].timeframe}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                
                <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-slate-300">
                    {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-purple-500 w-8' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                "{testimonial.content.substring(0, 120)}..."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm">{testimonial.name}</h5>
                  <p className="text-slate-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
