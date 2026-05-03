import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testsApi } from '@/api/tests';
import type { TestResource, CreateTestAnswersDto, CreateTestAnswerDto } from '@/types/test';
import { useI18n } from '@/i18n/I18nProvider';
import { showToast } from '@/components/Toast';
import AppLayout from '@/components/AppLayout';

export default function TestExecutionPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [test, setTest] = useState<TestResource | null>(null);
  const [progressId, setProgressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, CreateTestAnswerDto>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!testId) return;

    setLoading(true);
    testsApi.getById(Number(testId))
      .then((res) => {
        setTest(res.data);
        if (res.data.duration) {
          setTimeLeft(res.data.duration * 60);
        }
        return testsApi.startTest(Number(testId));
      })
      .then((res) => {
        setProgressId(res.data.id);
      })
      .catch((err) => {
        showToast(err.response?.data?.message || t('common.error'), 'error');
        navigate('/student/tests');
      })
      .finally(() => setLoading(false));
  }, [testId, navigate, t]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  const handleSubmit = useCallback(async () => {
    if (!progressId || submitting) return;
    setSubmitting(true);

    const payload: CreateTestAnswersDto = {
      answers: Object.values(answers),
    };

    try {
      await testsApi.finishTest(progressId, payload);
      showToast(t('tests.finished'), 'success');
      navigate('/student/tests');
    } catch (err: any) {
      showToast(err.response?.data?.message || t('common.error'), 'error');
      setSubmitting(false);
    }
  }, [progressId, answers, navigate, t, submitting]);

  const handleOptionToggle = (questionId: number, optionId: number, isMultiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || { questionId, optionIds: [] };
      let newOptionIds = current.optionIds || [];

      if (isMultiple) {
        if (newOptionIds.includes(optionId)) {
          newOptionIds = newOptionIds.filter((id) => id !== optionId);
        } else {
          newOptionIds = [...newOptionIds, optionId];
        }
      } else {
        newOptionIds = [optionId];
      }

      return {
        ...prev,
        [questionId]: { ...current, optionIds: newOptionIds },
      };
    });
  };

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, textAnswer: text },
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!test) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{test.name}</h1>
            <p className="mt-1 text-gray-600">{test.description}</p>
          </div>
          {timeLeft !== null && (
            <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {test.questions?.map((question, index) => (
            <div key={question.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {index + 1}
                </span>
                <h3 className="text-lg font-medium text-gray-900">{question.name}</h3>
              </div>

              {question.type === 'WRITING' ? (
                <textarea
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder={t('tests.writingPlaceholder')}
                  value={answers[question.id]?.textAnswer || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                />
              ) : (
                <div className="ml-12 space-y-3">
                  {question.answers.map((option) => (
                    <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50">
                      <input
                        type={question.type === 'OPTIONS_MULTIPLY' ? 'checkbox' : 'radio'}
                        name={`question-${question.id}`}
                        className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={answers[question.id]?.optionIds?.includes(option.id) || false}
                        onChange={() => handleOptionToggle(question.id, option.id, question.type === 'OPTIONS_MULTIPLY')}
                      />
                      <span className="text-gray-700">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : null}
            {t('common.submit')}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
