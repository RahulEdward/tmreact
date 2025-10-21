"use client";

import { Card, CardContent, Badge } from "@/components/ui";
import { FEATURES } from "@/lib/constants";
import { 
  BarChart3, 
  Building2, 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp 
} from "lucide-react";

const iconMap = {
  "bar-chart-3": BarChart3,
  "building-2": Building2,
  "brain": Brain,
  "zap": Zap,
  "shield": Shield,
  "trending-up": TrendingUp,
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for
            <span className="text-gradient"> Automated Trading</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to build, test, and deploy sophisticated trading strategies 
            with seamless broker integration and real-time execution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            
            return (
              <Card 
                key={feature.id} 
                className={`group relative overflow-hidden border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-violet-500/10`}
              >
                <CardContent className="p-6">
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {feature.badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-slate-800 text-slate-300 border-slate-700"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}