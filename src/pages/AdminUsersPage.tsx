import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/api/users';
import { ROLE_LABELS, ROLE_COLORS } from '@/types/auth';
import type { UsersFilter, UserResource } from '@/types/auth';

export default function AdminUsersPage() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState<UserResource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<UsersFilter>({
    page: 0,
    size: 50,
    authority: undefined,
    username: '',
    active: undefined,
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await usersApi.getFiltered(filter);
      setUsers(res.data.users || []);
      setTotal(res.data.totalElements || 0);
    } catch {
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter.page, filter.size, filter.authority, filter.active]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter((prev) => ({ ...prev, page: 0 }));
  };

  const primaryRole = user?.authorities?.[0] || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Looks Like Tests</h1>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
              Админ-панель
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.lastName} {user?.firstName}
            </span>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Фильтры</h2>
          <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <label className="block text-sm font-medium text-gray-700">Поиск</label>
              <input
                type="text"
                value={filter.username}
                onChange={(e) => setFilter((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Email или имя пользователя..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Роль</label>
              <select
                value={filter.authority ?? ''}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    authority: e.target.value || undefined,
                  }))
                }
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
                value={filter.active === undefined ? '' : filter.active ? 'active' : 'inactive'}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    active: e.target.value === '' ? undefined : e.target.value === 'active',
                  }))
                }
                className="mt-1 block w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Все</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Поиск
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Пользователи{' '}
              <span className="text-sm font-normal text-gray-500">({total} всего)</span>
            </h2>
          </div>

          {error && <div className="px-6 py-3 text-sm text-red-600">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
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
    </div>
  );
}
