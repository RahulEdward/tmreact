import { FC, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe, 
  Smartphone,
  Lock,
  Users,
  Clock,
  Target,
  Layers
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  stats?: string;
}

const FeatureSection: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const mainFeatures: Feature[] = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze market patterns and predict trends with 94% accuracy, giving you the edge in every trade.",
      gradient: "from-purple-600 to-pink-600",
      stats: "94% Accuracy"
    },
    {
      icon: Zap,
      title: "Lightning-Fast Execution",
      description: "Execute trades in microseconds with our ultra-low latency infrastructure. Never miss an opportunity again.",
      gradient: "from-blue-600 to-cyan-600",
      stats: "<1ms Latency"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Military-grade encryption and multi-layer security protocols protect your assets and data 24/7.",
      gradient: "from-green-600 to-emerald-600",
      stats: "256-bit Encryption"
    }
  ];

  const additionalFeatures: Feature[] = [
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Live market data and advanced charting tools for informed decision-making.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access to international markets and diverse trading instruments.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Trading",
      description: "Trade on-the-go with our responsive mobile-first design.",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      icon: Lock,
      title: "Secure Wallet",
      description: "Multi-signature cold storage for maximum asset protection.",
      gradient: "from-gray-600 to-gray-800"
    },
    {
      icon: Users,
      title: "Social Trading",
      description: "Follow successful traders and copy their strategies automatically.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support from trading experts.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-6 py-2 backdrop-blur-sm mb-6"
          >
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Cutting-Edge Features</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Revolutionary Trading
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the future of trading with our innovative platform that combines 
            artificial intelligence, lightning-fast execution, and enterprise-grade security.
          </p>
        </motion.div>

        {/* Main features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
        >
          {mainFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 h-full transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-800/70">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                
                {/* Stats */}
                {feature.stats && (
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${feature.gradient} bg-opacity-20 rounded-full`}>
                    <span className="text-sm font-semibold text-white">{feature.stats}</span>
                  </div>
                )}
                
                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {additionalFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive demo section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <Layers className="w-16 h-16 mx-auto mb-6 text-purple-400" />
          <h3 className="text-3xl font-bold text-white mb-4">
            See It in Action
          </h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience our platform's capabilities with an interactive demo. 
            No registration required - start exploring immediately.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-2xl"
          >
            Try Interactive Demo
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
