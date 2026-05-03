import { useState, useEffect } from 'react';
import { usersApi } from '@/api/users';
import { assignationsApi } from '@/api/assignations';
import type { UserResource } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';

export default function AssignStudentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<UserResource[]>([]);
  const [teachers, setTeachers] = useState<UserResource[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
      .catch(() => setError(t('assign.loadError')))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTeacher) return;
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await assignationsApi.createStudentToTeacher({
        studentId: parseInt(selectedStudent),
        teacherId: parseInt(selectedTeacher),
      });
      setSuccess(t('assign.success'));
      setSelectedStudent('');
      setSelectedTeacher('');
    } catch {
      setError(t('assign.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div>
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('assign.title')}</h2>

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

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
