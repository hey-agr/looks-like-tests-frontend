import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/api/users';
import { ROLE_LABELS, ROLE_COLORS } from '@/types/auth';
import type { UserResource } from '@/types/auth';

export default function AdminUsersPage() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState<UserResource[]>([]);
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
      .then((res) => setUsers(res.data.users || []))
      .catch(() => setError('Ошибка загрузки пользователей'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
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
  }, [users, search, roleFilter, statusFilter]);

  const primaryRole = user?.authorities?.[0] || '';

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Фильтры</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="block text-sm font-medium text-gray-700">Поиск</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Email или имя..."
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
              <option value="">Все роли</option>
              <option value="ADMIN">Администратор</option>
              <option value="TEACHER">Учитель</option>
              <option value="SUPERVISOR">Наблюдатель</option>
              <option value="STUDENT">Студент</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Статус</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Все</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Пользователи{' '}
            <span className="text-sm font-normal text-gray-500">({filtered.length} из {users.length})</span>
          </h2>
        </div>

        {error && <div className="px-6 py-3 text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">Пользователи не найдены</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 font-medium text-gray-600">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Email</th>
                  <th className="px-6 py-3 font-medium text-gray-600">ФИО</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Телефон</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Роль</th>
                  <th className="px-6 py-3 font-medium text-gray-600">Статус</th>
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
                          {ROLE_LABELS[userRole] ?? userRole}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.activated ? 'text-green-700' : 'text-red-700'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.activated ? 'bg-green-500' : 'bg-red-500'}`} />
                          {u.activated ? 'Активен' : 'Неактивен'}
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
    </main>
  );
}
