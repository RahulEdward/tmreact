"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { PRICING_TIERS } from "@/lib/constants";
import { Check } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent
            <span className="text-gradient"> Pricing</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your trading needs. All plans include our core features 
            with no hidden fees or setup costs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-300 ${
                tier.popular 
                  ? "border-violet-500 shadow-xl shadow-violet-500/20 scale-105" 
                  : "hover:border-slate-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {tier.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-slate-400 ml-1">/{tier.period}</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700" 
                      : ""
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={tier.ctaLink}>
                    {tier.ctaText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-500">
            <span>✓ 24/7 Support</span>
            <span>✓ 99.9% Uptime SLA</span>
            <span>✓ Enterprise Security</span>
          </div>
        </div>
      </div>
    </section>
  );
}