import { useAuth } from '@/context/AuthContext';
import { getRoleLabel } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const primaryRole = user?.authorities?.[0] || '';
  const isAdmin = primaryRole === 'ADMIN';

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('welcome')}, {user?.firstName}!
          </h2>
          <p className="mt-2 text-gray-600 mb-6">
            {t('welcome.role')}: {getRoleLabel(primaryRole, t)}
          </p>

          {isAdmin ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/admin/users"
                className="block rounded-lg border border-gray-200 p-4 hover:border-purple-300 hover:shadow-sm transition"
              >
                <h3 className="font-medium text-gray-900">{t('users.title')}</h3>
                <p className="mt-1 text-sm text-gray-500">Управление пользователями</p>
              </a>
              <a
                href="/admin/assignments"
                className="block rounded-lg border border-gray-200 p-4 hover:border-purple-300 hover:shadow-sm transition"
              >
                <h3 className="font-medium text-gray-900">Назначения</h3>
                <p className="mt-1 text-sm text-gray-500">Назначение студентов учителям</p>
              </a>
            </div>
          ) : (
            <a
              href="/supervisor"
              className="inline-block rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition"
            >
              <h3 className="font-medium text-gray-900">Назначения</h3>
              <p className="mt-1 text-sm text-gray-500">Назначение студентов учителям</p>
            </a>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
