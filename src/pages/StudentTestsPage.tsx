import { useState, useEffect } from 'react';
import { studentsApi } from '@/api/students';
import type { StudentTestAssignationResource, StudentTestHistoryResource } from '@/types/test';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';

export default function StudentTestsPage() {
  const { t } = useI18n();
  const [assignations, setAssignations] = useState<StudentTestAssignationResource[]>([]);
  const [results, setResults] = useState<StudentTestHistoryResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      studentsApi.getAssignations({ page: 0, size: 100, isActual: true }),
      studentsApi.getResults({ page: 0, size: 100 })
    ])
      .then(([assignationsRes, resultsRes]) => {
        setAssignations(assignationsRes.data.tests || []);
        setResults(resultsRes.data.tests || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Assigned Tests */}
        <div className="rounded-xl bg-white shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('tests.assigned')}
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
                    <th className="px-6 py-3 font-medium text-gray-600">{t('assign.test')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('common.description')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600 text-center">{t('common.attempts')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignations.map((item) => (
                    <tr key={item.testId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-700">{item.description || '—'}</td>
                      <td className="px-6 py-4 text-gray-700 text-center">{item.attempts}</td>
                    </tr>
                  ))}
                  {assignations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        {t('tests.noTests')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="rounded-xl bg-white shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('tests.results')}
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
                    <th className="px-6 py-3 font-medium text-gray-600">{t('assign.test')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600">{t('tests.dateFinished')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600 text-center">{t('tests.score')}</th>
                    <th className="px-6 py-3 font-medium text-gray-600 text-center">{t('tests.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((result) => (
                    <tr key={result.testProgressId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{result.name}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(result.dateFinished)}</td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        {result.rightAnswersCount} / {result.questionCount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          result.testResultStatus === 'PASS' ? 'bg-green-100 text-green-800' :
                          result.testResultStatus === 'FAIL' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {t(`tests.status.${result.testResultStatus}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        {t('tests.noTests')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
