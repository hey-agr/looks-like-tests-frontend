import { useAuth } from '@/context/AuthContext';
import { getRoleLabel } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';
import AssignStudentsPage from './AssignStudentsPage';
import { useState, useEffect } from 'react';
import { usersApi } from '@/api/users';
import { ROLE_COLORS } from '@/types/auth';
import type { UserResource } from '@/types/auth';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const primaryRole = user?.authorities?.[0] || '';

  const [users, setUsers] = useState<UserResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi
      .getFiltered({ page: 0, size: 200 })
      .then((res) => {
        setUsers(
          (res.data.users || []).filter(
            (u: UserResource) =>
              u.authorities?.includes('STUDENT') || u.authorities?.includes('TEACHER')
          )
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t('welcome')}, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            {t('welcome.role')}: {getRoleLabel(primaryRole, t)}
          </p>
        </div>

        {/* Students & Teachers list */}
        <div className="rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('users.title')}{' '}
              <span className="text-sm font-normal text-gray-500">(студенты и учителя)</span>
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 font-medium text-gray-600">{t('users.id')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('users.email')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('users.fullName')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('users.role')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('users.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => {
                    const userRole = u.authorities?.[0] || '';
                    return (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-500">{u.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{u.username}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {u.lastName} {u.firstName}
                          {u.middleName ? ` ${u.middleName}` : ''}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[userRole] ?? ''}`}>
                            {getRoleLabel(userRole, t)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.activated ? 'text-green-700' : 'text-red-700'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${u.activated ? 'bg-green-500' : 'bg-red-500'}`} />
                            {u.activated ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AssignStudentsPage />
      </div>
    </AppLayout>
  );
}
