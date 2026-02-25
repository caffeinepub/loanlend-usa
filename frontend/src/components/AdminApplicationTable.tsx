import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Search, Eye } from 'lucide-react';
import { LoanApplication, ApplicationStatus } from '@/backend';

interface AdminApplicationTableProps {
  applications: LoanApplication[];
  onViewApplication: (application: LoanApplication) => void;
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
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function statusLabel(s: ApplicationStatus): string {
  return s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

type SortField = 'submittedAt' | 'requestedAmount' | 'status';
type SortDir = 'asc' | 'desc';

export default function AdminApplicationTable({ applications, onViewApplication }: AdminApplicationTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let list = [...applications];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.borrowerId.toLowerCase().includes(q) ||
          a.purpose.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'submittedAt') {
        cmp = Number(a.submittedAt - b.submittedAt);
      } else if (sortField === 'requestedAmount') {
        cmp = Number(a.requestedAmount - b.requestedAmount);
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [applications, search, statusFilter, sortField, sortDir]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, borrower, or purpose…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ApplicationStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ApplicationStatus).map((s) => (
              <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Application ID</TableHead>
              <TableHead>Borrower ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 font-medium"
                  onClick={() => toggleSort('requestedAmount')}
                >
                  Amount <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Term</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 font-medium"
                  onClick={() => toggleSort('status')}
                >
                  Status <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 font-medium"
                  onClick={() => toggleSort('submittedAt')}
                >
                  Submitted <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[180px] truncate">
                    {app.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[140px] truncate">
                    {app.borrowerId}
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(app.requestedAmount)}</TableCell>
                  <TableCell>{Number(app.termMonths)} mo.</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(app.status)}>{statusLabel(app.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(app.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewApplication(app)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Showing {filtered.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
