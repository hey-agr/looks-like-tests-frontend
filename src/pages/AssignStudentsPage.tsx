import { useState, useEffect } from 'react';
import { usersApi } from '@/api/users';
import { assignationsApi } from '@/api/assignations';
import { ROLE_COLORS, getRoleLabel } from '@/types/auth';
import type { UserResource } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';
import { showToast } from '@/components/Toast';
import AppLayout from '@/components/AppLayout';

export default function AssignStudentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<UserResource[]>([]);
  const [teachers, setTeachers] = useState<UserResource[]>([]);
  const [users, setUsers] = useState<UserResource[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      usersApi.getFiltered({ page: 0, size: 200 }),
      usersApi.getFiltered({ page: 0, size: 200 }),
    ])
      .then(([studentsRes, teachersRes]) => {
        setStudents(
          (studentsRes.data.users || []).filter((u: UserResource) => u.authorities?.includes('STUDENT'))
        );
        setTeachers(
          (teachersRes.data.users || []).filter((u: UserResource) => u.authorities?.includes('TEACHER'))
        );
      })
      .catch(() => showToast(t('assign.loadError'), 'error'))
      .finally(() => setLoading(false));

    usersApi.getFiltered({ page: 0, size: 200 })
      .then((res) => setUsers((res.data.users || []).filter((u: UserResource) => u.authorities?.includes('STUDENT') || u.authorities?.includes('TEACHER'))))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTeacher) return;
    setSaving(true);
    try {
      await assignationsApi.createStudentToTeacher({
        studentId: parseInt(selectedStudent),
        teacherId: parseInt(selectedTeacher),
      });
      showToast(t('assign.success'), 'success');
      setSelectedStudent('');
      setSelectedTeacher('');
    } catch {
      showToast(t('assign.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Users table */}
        <div className="rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('users.title')}{' '}
              <span className="text-sm font-normal text-gray-500">(студенты и учителя)</span>
            </h2>
          </div>
          {usersLoading ? (
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

        {/* Assignment form */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('assign.title')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('assign.student')}</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">{t('assign.selectStudent')}</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.lastName} {s.firstName} ({s.username})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('assign.teacher')}</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">{t('assign.selectTeacher')}</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.lastName} {t.firstName} ({t.username})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedStudent || !selectedTeacher || saving}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? t('assign.loading') : t('assign.button')}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
