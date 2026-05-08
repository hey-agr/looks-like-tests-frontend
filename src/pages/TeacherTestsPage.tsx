import { useState, useEffect } from 'react';
import { testsApi } from '@/api/tests';
import type { TestResource } from '@/types/test';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';
import TestAssignModal from '@/components/TestAssignModal';
import CreateTestModal from '@/components/CreateTestModal';

export default function TeacherTestsPage() {
  const { t } = useI18n();
  const [tests, setTests] = useState<TestResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadTests = () => {
    setLoading(true);
    testsApi.getAll({ page: 0, size: 200 })
      .then((res) => setTests(res.data.tests || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTests();
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('tests.title')}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('tests.create')}
              </button>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {t('assign.button')}
              </button>
            </div>
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
                    <th className="px-6 py-3 font-medium text-gray-600">ID</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('assign.test')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('common.description')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-500">{test.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{test.name}</td>
                      <td className="px-6 py-4 text-gray-700">{test.description || '—'}</td>
                    </tr>
                  ))}
                  {tests.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="rounded-full bg-blue-50 p-3 mb-4">
                            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">{t('tests.noTests')}</h3>
                          <p className="mt-1 text-sm text-gray-500">{t('tests.noTestsDescription')}</p>
                          <div className="mt-6">
                            <button
                              onClick={() => setIsCreateModalOpen(true)}
                              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                              + {t('tests.create')}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <TestAssignModal 
          isOpen={isAssignModalOpen} 
          onClose={() => setIsAssignModalOpen(false)} 
        />
        <CreateTestModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={loadTests}
        />
      </div>
    </AppLayout>
  );
}
