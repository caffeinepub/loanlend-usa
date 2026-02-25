import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetBorrowerByPrincipal, useGetApplicationsByBorrower } from '@/hooks/useQueries';
import { LoanApplication, ApplicationStatus } from '@/backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import { PlusCircle, FileText, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import ApplicationDetailModal from '@/components/ApplicationDetailModal';

function getStatusVariant(status: ApplicationStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case ApplicationStatus.approved:
    case ApplicationStatus.disbursed:
      return 'default';
    case ApplicationStatus.rejected:
      return 'destructive';
    case ApplicationStatus.under_review:
      return 'secondary';
    default:
      return 'outline';
  }
}

function getStatusIcon(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.approved:
    case ApplicationStatus.disbursed:
      return <CheckCircle className="h-4 w-4" />;
    case ApplicationStatus.rejected:
      return <XCircle className="h-4 w-4" />;
    case ApplicationStatus.under_review:
      return <Clock className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function formatCurrency(amount: bigint): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amount));
}

function formatDate(time: bigint): string {
  return new Date(Number(time) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function statusLabel(s: ApplicationStatus): string {
  return s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BorrowerDashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  const { data: borrowerProfile, isLoading: profileLoading } = useGetBorrowerByPrincipal(principal);
  const { data: applications, isLoading: appsLoading } = useGetApplicationsByBorrower(borrowerProfile?.id);

  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLoading = profileLoading || appsLoading;

  const stats = {
    total: applications?.length ?? 0,
    pending: applications?.filter((a) => a.status === ApplicationStatus.pending).length ?? 0,
    approved: applications?.filter(
      (a) => a.status === ApplicationStatus.approved || a.status === ApplicationStatus.disbursed
    ).length ?? 0,
    rejected: applications?.filter((a) => a.status === ApplicationStatus.rejected).length ?? 0,
  };

  const handleViewApp = (app: LoanApplication) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {borrowerProfile ? `Welcome back, ${borrowerProfile.fullName}` : 'Manage your loan applications'}
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/apply' })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: FileText, color: 'text-primary' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-warning' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-success' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-destructive' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              My Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : !applications || applications.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
                <p className="text-muted-foreground">No applications yet.</p>
                <Button variant="outline" onClick={() => navigate({ to: '/apply' })}>
                  Submit Your First Application
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleViewApp(app)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${getStatusVariant(app.status) === 'destructive' ? 'text-destructive' : getStatusVariant(app.status) === 'default' ? 'text-success' : 'text-muted-foreground'}`}>
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          {formatCurrency(app.requestedAmount)}
                          <span className="text-muted-foreground font-normal text-sm">· {Number(app.termMonths)} mo.</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">{app.purpose}</p>
                        <p className="text-xs text-muted-foreground mt-1">Submitted {formatDate(app.submittedAt)}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(app.status)} className="shrink-0 self-start sm:self-center">
                      {statusLabel(app.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ApplicationDetailModal
        application={selectedApp}
        product={null}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedApp(null); }}
      />
    </div>
  );
}
