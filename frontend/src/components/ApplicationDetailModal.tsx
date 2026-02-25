import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Calendar, FileText, ClipboardList, User } from 'lucide-react';
import { LoanApplication, LoanProduct, ApplicationStatus } from '@/backend';

interface ApplicationDetailModalProps {
  application: LoanApplication | null;
  product: LoanProduct | null;
  open: boolean;
  onClose: () => void;
}

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

function formatCurrency(amount: bigint): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amount));
}

function formatDate(time: bigint): string {
  return new Date(Number(time) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function ApplicationDetailModal({
  application,
  product,
  open,
  onClose,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  const statusLabel = (s: ApplicationStatus) =>
    s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Application Details
          </DialogTitle>
          <DialogDescription>
            View the details of your loan application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Status</span>
            <Badge variant={getStatusVariant(application.status)}>
              {statusLabel(application.status)}
            </Badge>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Application ID</p>
                <p className="text-sm font-medium text-foreground break-all">{application.id}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <User className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Borrower ID</p>
                <p className="text-sm font-medium text-foreground break-all">{application.borrowerId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <DollarSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Requested Amount</p>
                <p className="text-sm font-medium text-foreground">{formatCurrency(application.requestedAmount)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Term</p>
                <p className="text-sm font-medium text-foreground">{Number(application.termMonths)} months</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 sm:col-span-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="text-sm font-medium text-foreground">{application.purpose}</p>
              </div>
            </div>
            {(product || application.productId) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 sm:col-span-2">
                <ClipboardList className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="text-sm font-medium text-foreground">
                    {product?.name ?? application.productId ?? 'N/A'}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-sm font-medium text-foreground">{formatDate(application.submittedAt)}</p>
              </div>
            </div>
            {application.reviewedAt != null && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Reviewed</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(application.reviewedAt)}</p>
                </div>
              </div>
            )}
          </div>

          {application.adminNotes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Admin Notes</p>
                <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">{application.adminNotes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
