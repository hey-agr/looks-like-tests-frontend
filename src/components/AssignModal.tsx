import { useState, useEffect } from 'react';
import { usersApi } from '@/api/users';
import { assignationsApi } from '@/api/assignations';
import type { UserResource } from '@/types/auth';
import { useI18n } from '@/i18n/I18nProvider';
import { showToast } from '@/components/Toast';
import Modal from './Modal';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AssignModal({ isOpen, onClose, onSuccess }: AssignModalProps) {
  const { t } = useI18n();
  const [students, setStudents] = useState<UserResource[]>([]);
  const [teachers, setTeachers] = useState<UserResource[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
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
    } else {
      setSelectedStudent('');
      setSelectedTeacher('');
    }
  }, [isOpen, t]);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTeacher) return;
    setSaving(true);
    try {
      await assignationsApi.createStudentToTeacher({
        studentId: parseInt(selectedStudent),
        teacherId: parseInt(selectedTeacher),
      });
      showToast(t('assign.success'), 'success');
      onSuccess?.();
      onClose();
    } catch {
      showToast(t('assign.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('assign.title')}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <>
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
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('common.back')}
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedStudent || !selectedTeacher || saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? t('assign.loading') : t('assign.button')}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
