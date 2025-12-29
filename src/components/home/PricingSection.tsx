import { Check, Crown, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const customerPlans = [
  {
    name: "Pay Per Call",
    price: "₹24",
    period: "per call",
    description: "Contact any agent instantly",
    features: [
      "Pay only when you call",
      "Access to all verified agents",
      "No commitment required",
      "Instant connection",
    ],
    popular: false,
  },
  {
    name: "Monthly Subscription",
    price: "₹399",
    period: "per month",
    description: "Unlimited agent access",
    features: [
      "Unlimited calls to all agents",
      "All 11+ categories included",
      "Priority support",
      "Save up to 80%",
    ],
    popular: true,
  },
];

const agentPlans = [
  {
    name: "Verified Agent",
    price: "₹1,000",
    period: "per month/category",
    description: "After 1 year free trial",
    features: [
      "First year FREE",
      "Verified badge on profile",
      "Receive customer leads",
      "Availability ON/OFF toggle",
      "Offer discounts & rewards",
    ],
    popular: true,
  },
  {
    name: "Premium Agent",
    price: "₹5,000",
    period: "per month",
    description: "From 3rd year onwards",
    features: [
      "20% additional benefits",
      "Featured in top listings",
      "Priority customer matching",
      "Exclusive store placement",
      "Multi-category support",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transparent pricing for customers and agents
          </p>
        </div>

        {/* Customer Pricing */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">For Customers</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {customerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-card rounded-2xl p-8 border ${
                  plan.popular ? "border-primary shadow-lg" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Pricing */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Crown className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">For Agents</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {agentPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-card rounded-2xl p-8 border ${
                  plan.popular ? "border-primary shadow-lg" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Best Value
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link to="/become-agent">Apply Now</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm">
            <Crown className="h-4 w-4" />
            <span>Premium customers get 15% off on clothing purchases!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
