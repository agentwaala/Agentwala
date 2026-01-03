import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Phone } from "lucide-react";

const faqs = [
  {
    question: "How do verified agents work?",
    answer: "Our agents undergo a multi-step verification process including identity checks and category-specific skill assessments. Once verified, they can accept calls and tasks directly through the platform.",
  },
  {
    question: "Is the service really free?",
    answer: "Yes! AgentWaala is currently free to use. Connect with verified agents across categories without any charges. We're building the future of agent marketplaces.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use end-to-end encryption for communications. Furthermore, our architecture is moving toward bare-metal execution to ensure the highest level of hardware-level security and speed.",
  },
  {
    question: "How can I become a verified agent?",
    answer: "You can apply through the 'Agent Portal'. You'll need to provide valid documentation and pass a brief interview within your chosen category (e.g., Real Estate, Medicine).",
  },
];

const FAQ = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Matching Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Support Center</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about our agent marketplace.
            </p>
          </div>

          {/* Accordion Wrapper with Gradient Border Effect */}
          <div className="relative group animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-[1px] bg-gradient-to-b from-border/50 via-primary/20 to-border/50 rounded-2xl" />
            <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-b border-border/50 last:border-0"
                  >
                    <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-4 font-semibold text-foreground transition-all">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <a 
                href="tel:9770574032" 
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5" />
                Call 9770574032
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;