import { ApplicationStatus } from '../backend';
import { cn } from '@/lib/utils';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  [ApplicationStatus.pending]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  [ApplicationStatus.under_review]: {
    label: 'Under Review',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  [ApplicationStatus.approved]: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  [ApplicationStatus.rejected]: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  [ApplicationStatus.disbursed]: {
    label: 'Disbursed',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
};

export default function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: String(status),
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
