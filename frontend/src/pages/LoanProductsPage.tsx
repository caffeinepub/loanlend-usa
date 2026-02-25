import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, DollarSign, Clock, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetLoanProducts } from '@/hooks/useQueries';
import { LoanProduct } from '@/backend';

function formatCurrency(amount: bigint): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amount));
}

function ProductCard({ product }: { product: LoanProduct }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full border-border hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-foreground">{product.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {product.interestRate.toFixed(1)}% APR
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <DollarSign className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Loan Range</p>
              <p className="text-sm font-medium text-foreground">
                {formatCurrency(product.minAmount)} – {formatCurrency(product.maxAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Term</p>
              <p className="text-sm font-medium text-foreground">Up to {Number(product.termMonths)} mo.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-success shrink-0" />
          <span>Competitive fixed rates available</span>
        </div>
        <div className="mt-auto pt-2">
          <Button
            className="w-full"
            onClick={() => navigate({ to: '/apply' })}
          >
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoanProductsPage() {
  const { data: products, isLoading, isError } = useGetLoanProducts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loan Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our range of flexible loan options designed to meet your financial needs.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading loan products…</span>
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <p className="text-destructive font-medium">Failed to load loan products. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && products && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No loan products are currently available. Please check back soon.</p>
            </div>
          )}

          {!isLoading && !isError && products && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle, title: 'Fast Approval', desc: 'Get a decision within 24 hours of submitting your application.' },
              { icon: DollarSign, title: 'Competitive Rates', desc: 'We offer some of the most competitive interest rates in the market.' },
              { icon: Clock, title: 'Flexible Terms', desc: 'Choose repayment terms that fit your budget and lifestyle.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
                <Icon className="h-10 w-10 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
