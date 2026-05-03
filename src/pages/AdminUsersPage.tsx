import { useState, useEffect } from 'react';
import { ROLE_COLORS, getRoleLabel } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';

import { usersApi } from '@/api/users';
import type { UserResource } from '@/types/auth';

export default function AdminUsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<UserResource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    usersApi
      .getFiltered({ page: 0, size: 200 })
      .then((res) => {
        setUsers(res.data.users || []);
        setTotal(res.data.totalElements || 0);
      })
      .catch(() => setError(t('users.loadError')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const userRole = u.authorities?.[0] || '';
    if (search && !u.username.toLowerCase().includes(search.toLowerCase()) &&
        !u.lastName?.toLowerCase().includes(search.toLowerCase()) &&
        !u.firstName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (roleFilter && userRole !== roleFilter) return false;
    if (statusFilter === 'active' && !u.activated) return false;
    if (statusFilter === 'inactive' && u.activated) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('common.search')}</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="block text-sm font-medium text-gray-700">Поиск</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('users.email')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Роль</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-1 block w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('common.allRoles')}</option>
              <option value="ADMIN">{t('auth.roleAdmin')}</option>
              <option value="TEACHER">{t('auth.roleTeacher')}</option>
              <option value="SUPERVISOR">{t('auth.roleSupervisor')}</option>
              <option value="STUDENT">{t('auth.roleStudent')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Статус</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('common.allStatuses')}</option>
              <option value="active">{t('common.active')}</option>
              <option value="inactive">{t('common.inactive')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('users.title')}{' '}
            <span className="text-sm font-normal text-gray-500">({filtered.length} из {users.length})</span>
          </h2>
        </div>

        {error && <div className="px-6 py-3 text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">{t('users.notFound')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 font-medium text-gray-600">{t('users.id')}</th>
                  <th className="px-6 py-3 font-medium text-gray-600">{t('users.email')}</th>
                  <th className="px-6 py-3 font-medium text-gray-600">{t('users.fullName')}</th>
                  <th className="px-6 py-3 font-medium text-gray-600">{t('users.phone')}</th>
                  <th className="px-6 py-3 font-medium text-gray-600">{t('users.role')}</th>
                  <th className="px-6 py-3 font-medium text-gray-600">{t('users.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => {
                  const userRole = u.authorities?.[0] || '';
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-500">{u.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{u.username}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {u.lastName} {u.firstName}
                        {u.middleName ? ` ${u.middleName}` : ''}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.phone || '—'}</td>
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
    </div>
  );
}
