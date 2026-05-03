import { useAuth } from '@/context/AuthContext';
import { getRoleLabel } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';
import AdminUsersPage from './AdminUsersPage';
import AssignStudentsPage from './AssignStudentsPage';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const primaryRole = user?.authorities?.[0] || '';
  const hasAccess = primaryRole === 'ADMIN' || primaryRole === 'SUPERVISOR';

  if (!hasAccess) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('welcome')}, {user?.firstName}!
            </h2>
            <p className="mt-2 text-gray-600">
              {t('welcome.role')}: {getRoleLabel(primaryRole, t)}
            </p>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <AdminUsersPage />
        <AssignStudentsPage />
      </div>
    </AppLayout>
  );
}
