import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Shield, Clock, TrendingUp, Star, Users, DollarSign } from 'lucide-react';
import { useGetLoanProducts } from '../hooks/useQueries';

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gold" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white font-display">{value}</div>
      <div className="text-white/60 text-sm mt-0.5">{label}</div>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xl font-display mb-4 shadow-card-lg">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const { data: products = [] } = useGetLoanProducts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy min-h-[560px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1440x560.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <Star className="h-3.5 w-3.5 text-gold fill-gold" />
              <span className="text-gold text-sm font-medium">Trusted by 50,000+ Americans</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Smart Loans for
              <span className="text-gold block">Your Future</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Get competitive rates, fast approvals, and transparent terms. Apply in minutes and receive funds in as little as 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-navy font-bold text-base shadow-gold px-8"
              >
                <Link to="/apply">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8"
              >
                <Link to="/products">View Loan Options</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              {['No hidden fees', 'Rates from 5.99% APR', 'Soft credit check'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <CheckCircle className="h-4 w-4 text-gold" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-dark py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={Users} value="50K+" label="Happy Borrowers" />
            <StatCard icon={DollarSign} value="$2B+" label="Loans Funded" />
            <StatCard icon={Clock} value="24hrs" label="Avg. Approval Time" />
            <StatCard icon={Star} value="4.9/5" label="Customer Rating" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Getting a loan has never been easier. Our streamlined process gets you funded fast.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            <div className="hidden md:block absolute top-7 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-gold/30 via-gold to-gold/30" />
            <StepCard
              step={1}
              title="Apply Online"
              description="Complete our simple 4-step application in under 10 minutes. No paperwork, no branch visits required."
            />
            <StepCard
              step={2}
              title="Get Approved"
              description="Our team reviews your application quickly. Most decisions are made within 24 hours of submission."
            />
            <StepCard
              step={3}
              title="Receive Funds"
              description="Once approved, funds are deposited directly to your bank account — often the same business day."
            />
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-navy hover:bg-navy-light text-white font-semibold px-8">
              <Link to="/apply">Start Your Application <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-secondary border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Trusted & Secure
            </p>
            <img
              src="/assets/generated/trust-badges.dim_800x120.png"
              alt="Security and trust badges"
              className="max-w-full h-auto max-h-20 object-contain"
            />
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: Shield, text: '256-bit SSL Encryption' },
                { icon: CheckCircle, text: 'FDIC Insured Partners' },
                { icon: TrendingUp, text: 'BBB Accredited' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gold" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Our Loan Products
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Choose from a variety of loan options tailored to your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product) => (
                <Card key={product.id} className="shadow-card hover:shadow-card-lg transition-shadow border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-navy text-lg">{product.name}</h3>
                      <span className="text-gold font-bold text-lg">{product.interestRate.toFixed(2)}%</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>
                    <div className="space-y-2 mb-5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Loan Range</span>
                        <span className="font-medium">
                          ${Number(product.minAmount).toLocaleString()} – ${Number(product.maxAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Term</span>
                        <span className="font-medium">{Number(product.termMonths)} months</span>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-navy hover:bg-navy-light text-white">
                      <Link to="/apply" search={{ productId: product.id }}>
                        Apply Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {products.length > 3 && (
              <div className="text-center mt-8">
                <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Americans who have trusted LendBridge USA for their financial needs.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold-dark text-navy font-bold text-base shadow-gold px-10"
          >
            <Link to="/apply">
              Apply for a Loan Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
