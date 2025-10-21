"use client";

import { Button, Badge } from "@/components/ui";
import Link from "next/link";
import { ArrowRight, Play, BookOpen } from "lucide-react";
import { STATS } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-950 to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Status Badge */}
        <Badge variant="outline" className="mb-8 bg-violet-500/10 border-violet-500/20 text-violet-300">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Live & Trading
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gradient">
            TradingView Bridge &
          </span>
          <br />
          <span className="text-gradient">
            Auto Trading Strategy Builder
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect TradingView alerts to multiple brokers for seamless automated trading. 
          Build, backtest, and deploy strategies with our no-code platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Button size="lg" variant="gradient" asChild>
            <Link href="/register">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800" asChild>
            <Link href="#demo">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Link>
          </Button>
          
          <Button size="lg" variant="ghost" className="text-slate-400 hover:text-white" asChild>
            <Link href="/docs">
              <BookOpen className="mr-2 h-5 w-5" />
              Documentation
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-800">
          {STATS.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}