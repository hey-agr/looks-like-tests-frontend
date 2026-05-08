import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsApi } from '@/api/students';
import type { StudentTestAssignationResource, StudentTestHistoryResource } from '@/types/test';
import { useI18n } from '@/i18n/I18nProvider';
import AppLayout from '@/components/AppLayout';

export default function StudentTestsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
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
                    <th className="px-6 py-3 font-medium text-gray-600 text-right">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignations.map((item) => (
                    <tr key={item.testId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-700">{item.description || '—'}</td>
                      <td className="px-6 py-4 text-gray-700 text-center">{item.attempts}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/student/tests/${item.testId}`)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                          {t('tests.start')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assignations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="rounded-full bg-gray-50 p-3 mb-4">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.582.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">{t('tests.noTests')}</h3>
                          <p className="mt-1 text-sm text-gray-500">{t('tests.noAssignedTestsDescription')}</p>
                        </div>
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
                          result.testResultStatus === 'PASS' || result.testResultStatus === 'PASSED' 
                            ? 'bg-green-100 text-green-800 border border-green-200' :
                          result.testResultStatus === 'FAIL' || result.testResultStatus === 'FAILED' 
                            ? 'bg-red-100 text-red-800 border border-red-200' :
                          result.testResultStatus === 'PENDING' || result.testResultStatus === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {t(`tests.status.${result.testResultStatus}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="rounded-full bg-gray-50 p-3 mb-4">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">{t('tests.noTests')}</h3>
                        </div>
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
