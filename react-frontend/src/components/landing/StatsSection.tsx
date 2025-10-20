import { FC, useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Globe, Award, Zap } from 'lucide-react';

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
  gradient: string;
}

const StatsSection: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats: Stat[] = [
    {
      icon: Users,
      value: "250000",
      suffix: "+",
      label: "Active Traders",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: DollarSign,
      value: "15",
      suffix: "B+",
      prefix: "$",
      label: "Trading Volume",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      value: "150",
      suffix: "+",
      label: "Countries Served",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      value: "98.7",
      suffix: "%",
      label: "Uptime Guarantee",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Award,
      value: "50",
      suffix: "+",
      label: "Industry Awards",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Zap,
      value: "0.1",
      suffix: "ms",
      label: "Average Latency",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [isInView, controls, hasAnimated]);

  const CountUpAnimation: FC<{ 
    value: string; 
    prefix?: string; 
    suffix?: string; 
    duration?: number 
  }> = ({ value, prefix = "", suffix = "", duration = 2 }) => {
    const [count, setCount] = useState(0);
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    
    useEffect(() => {
      if (!isInView) return;
      
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(numericValue * progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [isInView, numericValue, duration]);

    const formatCount = (num: number) => {
      if (value.includes('.')) {
        return num.toFixed(1);
      }
      return Math.floor(num).toLocaleString();
    };

    return (
      <span className="font-bold text-4xl md:text-5xl">
        {prefix}{formatCount(count)}{suffix}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Trusted by Millions
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join the global community of successful traders who trust our platform 
            for their trading needs. Our numbers speak for themselves.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group relative"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Value */}
                <div className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  <CountUpAnimation 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                    duration={2 + index * 0.2}
                  />
                </div>
                
                {/* Label */}
                <p className="text-slate-300 font-medium">{stat.label}</p>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement badges */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { name: "Best Trading Platform 2024", org: "FinTech Awards" },
            { name: "Most Innovative AI", org: "Tech Excellence" },
            { name: "Security Excellence", org: "CyberSafe Certification" },
            { name: "Customer Choice Award", org: "Trading Community" }
          ].map((award, index) => (
            <motion.div
              key={award.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{award.name}</h4>
              <p className="text-xs text-slate-400">{award.org}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
