import React from 'react';
import img from "../assets/ceo.png"
import { Building2, Target, Lightbulb, Users, CheckCircle2 } from 'lucide-react';

const CeoAbout = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 ">
            {/* Left Side - Image */}
            <div className="animate-fade-up">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-sky-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary/10 to-sky-500/10 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
                  <img
                    src={img}
                    alt="Nihal Malviya - Founder & CEO"
                    className="w-full aspect-square object-cover rounded-xl shadow-2xl"
                  />
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-foreground">Nihal Malviya</h3>
                    <p className="text-primary font-semibold mt-1">Founder & CEO</p>
                    <p className="text-sm text-muted-foreground mt-2">MBA, Chandigarh University</p>
                    <p className="text-sm text-muted-foreground">Chhindwara, Madhya Pradesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {/* Introduction */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                  <Users className="h-3.5 w-3.5" />
                  <span>About the Founder</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Meet the Mind Behind <span className="gradient-text">Agentwaala</span>
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Hello, I'm <span className="font-semibold text-foreground">Nihal Malviya</span>, Founder & CEO of Agentwaala.com. 
                  I'm from Chhindwara, Madhya Pradesh, and I hold an MBA from Chandigarh University.
                </p>
              </div>

              {/* Origin Story */}
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Lightbulb className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Origin Story</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Agentwaala was born from a real, ground-level problem I personally observed in Indian markets. 
                      Across industries such as real estate, agriculture, FMCG, beauty products, travel, and trade, 
                      agents play a critical role, yet there is no single trusted platform where businesses or buyers 
                      can easily find verified, city-wise agents.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed ml-9">
                  Today, finding the right agent depends on word of mouth, random phone numbers, or unreliable 
                  references, which wastes time, creates trust issues, and slows down business. 
                  <span className="font-semibold text-foreground"> Agentwaala solves this gap.</span>
                </p>
              </div>

              {/* What Agentwaala Does */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">What Agentwaala Does</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Agentwaala is a multi-category agent discovery platform that connects verified agents with 
                  customers, wholesalers, and businesses across India—quickly, transparently, and location-wise.
                </p>
              </div>

              {/* Problem We Solve */}
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Problem We Solve</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "No centralized platform for agents",
                    "Lack of trust and verification",
                    "Time wasted in searching and calling the wrong people",
                    "No visibility into agent availability or specialization"
                  ].map((problem, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Unique USP */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  Our Unique USP
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "City-wise and category-wise agent discovery",
                    "Multi-industry coverage on one platform",
                    "Agent availability transparency",
                    "Clean, simple, and scalable business model",
                    "Built for India's real market structure"
                  ].map((usp, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{usp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-br from-primary/10 to-sky-500/10 border border-primary/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Why I Built Agentwaala</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I believe agents are the backbone of Indian trade, but they remain digitally invisible. 
                  Agentwaala brings them into the digital ecosystem while helping businesses save time, 
                  reduce risk, and grow faster.
                </p>
                <p className="font-semibold text-foreground">
                  My vision is to make Agentwaala India's most trusted agent marketplace, empowering agents 
                  and simplifying business connections nationwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoAbout;