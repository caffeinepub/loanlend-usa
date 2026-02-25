import { useState } from 'react';
import { useGetAllApplications, useIsCallerAdmin } from '@/hooks/useQueries';
import { LoanApplication } from '@/backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, ClipboardList, Loader2 } from 'lucide-react';
import AdminApplicationTable from '@/components/AdminApplicationTable';
import AdminApplicationDetailModal from '@/components/AdminApplicationDetailModal';

export default function AdminPanelPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: applications, isLoading: appsLoading } = useGetAllApplications();

  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewApplication = (app: LoanApplication) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          You do not have permission to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">Manage and review all loan applications.</p>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <AdminApplicationTable
                applications={applications ?? []}
                onViewApplication={handleViewApplication}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AdminApplicationDetailModal
        application={selectedApp}
        product={null}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedApp(null); }}
      />
    </div>
  );
}
