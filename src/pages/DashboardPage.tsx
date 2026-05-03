import AppLayout from '@/components/AppLayout';
import AdminUsersPage from './AdminUsersPage';
import AssignStudentsPage from './AssignStudentsPage';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <AdminUsersPage />
        <AssignStudentsPage />
      </div>
    </AppLayout>
  );
}
