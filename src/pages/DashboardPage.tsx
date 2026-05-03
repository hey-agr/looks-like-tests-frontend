import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/types/auth';
import { useI18n, LanguageSwitcher } from '@/i18n/I18nProvider';
import AdminUsersPage from './AdminUsersPage';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const primaryRole = user?.authorities?.[0] || '';
  const isAdmin = primaryRole === 'ADMIN';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
            {isAdmin && (
              <span className="rounded-full px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800">
                {t('app.admin')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.lastName} {user?.firstName}
                  </p>
                  <p className="text-xs text-gray-500">{ROLE_LABELS[primaryRole] ?? primaryRole}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {isAdmin ? (
        <AdminUsersPage />
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('welcome')}, {user?.firstName}!
            </h2>
            <p className="mt-2 text-gray-600">
              {t('welcome.role')}: {ROLE_LABELS[primaryRole] ?? primaryRole}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/profile"
                className="block rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-gray-900">{t('profile')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('profile.edit')}</p>
              </Link>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
