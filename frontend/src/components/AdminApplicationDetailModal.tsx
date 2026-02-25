import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, DollarSign, Calendar, FileText, ClipboardList } from 'lucide-react';
import { LoanApplication, LoanProduct, ApplicationStatus } from '@/backend';
import { useUpdateApplicationStatus } from '@/hooks/useQueries';

interface AdminApplicationDetailModalProps {
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

export default function AdminApplicationDetailModal({
  application,
  product,
  open,
  onClose,
}: AdminApplicationDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');
  const [adminNotes, setAdminNotes] = useState('');

  const updateStatus = useUpdateApplicationStatus();

  const handleSubmit = async () => {
    if (!application || !selectedStatus) return;
    await updateStatus.mutateAsync({
      appId: application.id,
      status: selectedStatus as ApplicationStatus,
      adminNotes: adminNotes.trim() || null,
    });
    setSelectedStatus('');
    setAdminNotes('');
    onClose();
  };

  if (!application) return null;

  const statusLabel = (s: ApplicationStatus) =>
    s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Application Details
          </DialogTitle>
          <DialogDescription>
            Review and update the status of this loan application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">Current Status</span>
            <Badge variant={getStatusVariant(application.status)}>
              {statusLabel(application.status)}
            </Badge>
          </div>

          <Separator />

          {/* Application Info */}
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

          <Separator />

          {/* Update Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Update Status</h3>
            <div className="space-y-2">
              <Label htmlFor="status-select">New Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as ApplicationStatus)}
              >
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select a status…" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ApplicationStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes (optional)</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add notes about this decision…"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end pt-1">
              <Button variant="outline" onClick={onClose} disabled={updateStatus.isPending}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedStatus || updateStatus.isPending}
              >
                {updateStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
