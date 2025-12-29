import { Search, BadgeCheck, Phone, Handshake } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Agent",
    description: "Browse verified agents across 11+ categories in your city",
  },
  {
    icon: BadgeCheck,
    title: "Check Profile",
    description: "View verified badges, ratings, and availability status",
  },
  {
    icon: Phone,
    title: "Connect",
    description: "Call directly or schedule a call at your convenience",
  },
  {
    icon: Handshake,
    title: "Get it Done",
    description: "Complete your deal with trusted, local expertise",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple <span className="gradient-text">4-Step</span> Process
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connecting with verified agents has never been easier
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
