"use client";

import { Card, CardContent, Badge } from "@/components/ui";
import { BROKERS } from "@/lib/constants";

export function Brokers() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "connected":
        return "connected";
      case "available":
        return "available";
      case "coming-soon":
        return "coming-soon";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "available":
        return "Available";
      case "coming-soon":
        return "Coming Soon";
      default:
        return status;
    }
  };

  return (
    <section id="brokers" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Supported
            <span className="text-gradient"> Brokers</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Connect to your favorite brokers with our unified API. 
            More integrations are added regularly based on user demand.
          </p>
        </div>

        {/* Brokers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BROKERS.map((broker) => (
            <Card 
              key={broker.id} 
              className="group border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 transition-all duration-300 hover:border-slate-700 hover:shadow-lg"
            >
              <CardContent className="p-6">
                {/* Header with logo and status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{broker.logo}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-gradient transition-colors duration-300">
                        {broker.name}
                      </h3>
                      {broker.region && (
                        <p className="text-sm text-slate-500">{broker.region}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(broker.status)}>
                    {getStatusText(broker.status)}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {broker.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                    Key Features
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {broker.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-slate-700 text-slate-400"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            Don't see your broker? We're constantly adding new integrations.
          </p>
          <Badge variant="outline" className="border-slate-700 text-slate-300">
            Request a broker integration
          </Badge>
        </div>
      </div>
    </section>
  );
}