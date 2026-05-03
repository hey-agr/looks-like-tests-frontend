import { useState, useEffect } from 'react';
import { usersApi } from '@/api/users';
import { testsApi } from '@/api/tests';
import { assignationsApi } from '@/api/assignations';
import type { UserResource } from '@/types/auth';
import type { TestResource } from '@/types/test';
import { useI18n } from '@/i18n/I18nProvider';
import { showToast } from '@/components/Toast';
import Modal from './Modal';

interface TestAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TestAssignModal({ isOpen, onClose, onSuccess }: TestAssignModalProps) {
  const { t } = useI18n();
  const [students, setStudents] = useState<UserResource[]>([]);
  const [tests, setTests] = useState<TestResource[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        usersApi.getFiltered({ page: 0, size: 200 }),
        testsApi.getAll({ page: 0, size: 200 }),
      ])
        .then(([studentsRes, testsRes]) => {
          setStudents(
            (studentsRes.data.users || []).filter((u: UserResource) => u.authorities?.includes('STUDENT'))
          );
          setTests(testsRes.data.tests || []);
        })
        .catch(() => showToast(t('assign.loadError'), 'error'))
        .finally(() => setLoading(false));
    } else {
      setSelectedStudent('');
      setSelectedTest('');
    }
  }, [isOpen, t]);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTest) return;
    setSaving(true);
    try {
      await assignationsApi.createStudentToTest({
        studentId: parseInt(selectedStudent),
        testId: parseInt(selectedTest),
      });
      showToast(t('assign.testSuccess'), 'success');
      onSuccess?.();
      onClose();
    } catch {
      showToast(t('assign.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('assign.testTitle')}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('assign.test')}</label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">{t('assign.selectTest')}</option>
                {tests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.name}
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
                disabled={!selectedStudent || !selectedTest || saving}
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
