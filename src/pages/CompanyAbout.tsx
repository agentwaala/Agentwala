import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, ArrowRight,Cpu, Globe, Users } from "lucide-react";

const CompanyAbout = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* 1. ABOUT SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our <span className="gradient-text">Mission</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are revolutionizing how users connect with specialized service agents. 
              By moving toward <strong>Bare-Metal Agentic Execution</strong>, we eliminate 
              unnecessary software layers to provide the fastest, most secure direct-to-hardware 
              communication between customers and verified experts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: <Cpu className="h-8 w-8 text-primary" />, title: "Bare-Metal Speed", desc: "Direct hardware communication without OS overhead." },
              { icon: <Globe className="h-8 w-8 text-primary" />, title: "Global Network", desc: "Access verified agents from every continent instantly." },
              { icon: <Users className="h-8 w-8 text-primary" />, title: "Verified Human-AI", desc: "The perfect blend of human expertise and agentic efficiency." },
            ].map((feature, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 2. BLOG SECTION */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Updates</h2>
              <p className="text-muted-foreground">Insights into the future of agentic marketplaces.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex group">
              View all posts <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "The Future of Bare-Metal Agents", date: "Dec 15, 2025", category: "Technology" },
              { title: "How to Scale Your Agency in 2026", date: "Dec 10, 2025", category: "Business" },
              { title: "Security Protocols in Hardware Execution", date: "Dec 05, 2025", category: "Engineering" },
            ].map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{post.category}</div>
                </div>
                <p className="text-sm text-primary mb-2 font-medium">{post.date}</p>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CONTACT SECTION */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              {/* Contact Info */}
              <div className="p-8 md:p-12 bg-primary text-primary-foreground">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="opacity-80 mb-12">Have questions about our verified agents or the technical infrastructure? Our team is here to help.</p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg"><Mail className="h-6 w-6" /></div>
                    <div><p className="text-sm opacity-70">Email us</p><p className="font-medium">agentwaala@gmail.com</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg"><Phone className="h-6 w-6" /></div>
                    <div><p className="text-sm opacity-70">Call us</p><p className="font-medium">9770574032</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg"><MapPin className="h-6 w-6" /></div>
                    <div><p className="text-sm opacity-70">Visit us</p><p className="font-medium">Ward no. 04, satyam shivam colony, chhindwara, Madhya Pradesh, India</p></div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-8 md:p-12 bg-white">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-primary/20 outline-none" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-primary/20 outline-none" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea className="w-full px-4 py-2 border rounded-lg h-32 focus:ring-2 ring-primary/20 outline-none" placeholder="Tell us how we can help..." />
                  </div>
                  <Button className="w-full h-12 text-lg">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyAbout;