import React from 'react';
import { ScrollText, ShieldCheck, Scale, AlertCircle } from "lucide-react";

const TermsAndConditions = () => {
  const lastUpdated = "December 31, 2025";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      content: "By accessing or using our platform, you agree to be bound by these Terms and Conditions. Our service facilitates direct communication with verified agents. Any interaction with Bare-Metal Agentic systems is subject to hardware availability and technical constraints."
    },
    {
      id: "agents",
      title: "2. Agent Verification",
      icon: <Scale className="h-5 w-5 text-primary" />,
      content: "While we verify the identity of agents, we do not guarantee the specific outcomes of their advice or services. Users are encouraged to perform their own due diligence when transacting with agents in categories like Medicine or Real Estate."
    },
    {
      id: "hardware",
      title: "3. Bare-Metal Execution",
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      content: "Our proprietary Bare-Metal Agentic Execution allows agents to run tasks with direct hardware access. Users acknowledge that this may result in non-standard execution environments and accept the associated risks of low-latency, high-performance computing."
    },
    {
      id: "payments",
      title: "4. Fees and Payments",
      icon: <ScrollText className="h-5 w-5 text-primary" />,
      content: "A standard fee of ₹24 is charged per connection call. This fee is non-refundable once the agent is successfully connected via the secure hardware line. Additional service fees are negotiated between the user and the agent."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold mb-4">Terms & <span className="gradient-text">Conditions</span></h1>
            <p className="text-muted-foreground italic">Last Updated: {lastUpdated}</p>
          </div>

          <div className="grid md:grid-cols-[250px_1fr] gap-12">
            
            {/* Quick Links Sidebar */}
            <aside className="hidden md:block space-y-4 sticky top-32 h-fit">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">On this page</p>
              {sections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary pl-4"
                >
                  {section.title.split('. ')[1]}
                </a>
              ))}
            </aside>

            {/* Main Content */}
            <div className="space-y-16 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </section>
              ))}

              {/* Final Note */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                <p className="text-sm text-muted-foreground text-center">
                  Questions regarding these terms? Please contact our legal department at 
                  <span className="text-primary font-medium"> legal@agentic.io</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;