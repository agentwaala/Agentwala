import React from 'react';
import { ScrollText, ShieldCheck, Scale, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "December 31, 2025";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      content: "This Privacy Policy explains how we collect, use, and disclose your personal information when you use our platform. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner."
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      icon: <Scale className="h-5 w-5 text-primary" />,
      content: "We may collect personal information from you such as your name, email address, phone number, and payment information. We also collect non-personal information such as your IP address, browser type, and operating system."
    },
    {
      id: "how-we-use-your-information",
      title: "3. How We Use Your Information",
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      content: "We use your personal information to provide and improve our services, to process payments, to communicate with you, and to comply with legal obligations. We may also use your information for marketing purposes, but you can opt-out at any time."
    },
    {
      id: "data-security",
      title: "4. Data Security",
      icon: <ScrollText className="h-5 w-5 text-primary" />,
      content: "We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 animate-fade-up">
            <h1 className="text-4xl font-bold mb-4">Privacy <span className="gradient-text">Policy</span></h1>
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
                  Questions regarding this privacy policy? Please contact our legal department at 
                  <span className="text-primary font-medium"> agentwaala@gmail.com</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;