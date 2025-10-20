import { FC, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X, Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  premium?: boolean;
  gradient: string;
  icon: React.ElementType;
}

const PricingSection: FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: isAnnual ? "29" : "39",
      period: isAnnual ? "/month (billed annually)" : "/month",
      description: "Perfect for individual traders getting started",
      features: [
        "Real-time market data",
        "Basic AI analytics",
        "5 simultaneous trades",
        "Mobile app access",
        "Email support",
        "Basic charting tools"
      ],
      limitations: [
        "Limited to 100 trades/month",
        "No advanced AI features"
      ],
      gradient: "from-blue-500 to-cyan-500",
      icon: Zap
    },
    {
      name: "Professional",
      price: isAnnual ? "79" : "99",
      period: isAnnual ? "/month (billed annually)" : "/month",
      description: "Advanced features for serious traders",
      features: [
        "Everything in Starter",
        "Advanced AI predictions",
        "Unlimited trades",
        "Priority execution",
        "Advanced charting",
        "Portfolio analytics",
        "24/7 chat support",
        "Custom indicators",
        "Risk management tools"
      ],
      popular: true,
      gradient: "from-purple-500 to-pink-500",
      icon: Star
    },
    {
      name: "Enterprise",
      price: isAnnual ? "199" : "249",
      period: isAnnual ? "/month (billed annually)" : "/month",
      description: "Complete solution for institutions and teams",
      features: [
        "Everything in Professional",
        "White-label solution",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security features",
        "Team collaboration tools",
        "Custom reporting",
        "SLA guarantee"
      ],
      premium: true,
      gradient: "from-yellow-500 to-orange-500",
      icon: Crown
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
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"></div>
      
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
            <Crown className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Flexible Pricing</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Trading Plan
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Start with our free trial and upgrade as you grow. All plans include 
            our core features with no hidden fees.
          </p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full p-1"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                isAnnual 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 25%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative group ${
                plan.popular ? 'lg:scale-105 lg:z-10' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`bg-slate-800/50 backdrop-blur-sm border ${
                plan.popular 
                  ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' 
                  : 'border-slate-700/50'
              } rounded-2xl p-8 h-full transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-800/70 relative overflow-hidden`}>
                
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-green-400 text-sm mt-2">Save 25% annually</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/register"
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50 hover:border-slate-500/50'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              We offer tailored solutions for large institutions, hedge funds, and enterprises 
              with specific requirements. Contact our sales team for a personalized quote.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
            >
              Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
