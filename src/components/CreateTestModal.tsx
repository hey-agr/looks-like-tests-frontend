import React, { useState } from 'react';
import Modal from './Modal';
import { useI18n } from '@/i18n/I18nProvider';
import { testsApi } from '@/api/tests';
import type { CreateTestDto, CreateQuestionDto, CreateOptionDto, QuestionType } from '@/types/test';
import { useToast } from './Toast';

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTestModal({ isOpen, onClose, onSuccess }: CreateTestModalProps) {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [testData, setTestData] = useState<CreateTestDto>({
    name: '',
    description: '',
    duration: 3600,
    minRightAnswers: 1,
    attempts: 1,
    questions: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testData.questions.length === 0) {
      showToast('Add at least one question', 'error');
      return;
    }

    setLoading(true);
    try {
      await testsApi.create(testData);
      showToast(t('tests.createSuccess'), 'success');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating test:', error);
      showToast(t('tests.createError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: CreateQuestionDto = {
      name: '',
      type: 'OPTIONS',
      answers: []
    };
    setTestData({ ...testData, questions: [...testData.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const questions = [...testData.questions];
    questions.splice(index, 1);
    setTestData({ ...testData, questions });
  };

  const updateQuestion = (index: number, field: keyof CreateQuestionDto, value: any) => {
    const questions = [...testData.questions];
    questions[index] = { ...questions[index], [field]: value };
    setTestData({ ...testData, questions });
  };

  const addOption = (qIndex: number) => {
    const questions = [...testData.questions];
    const newOption: CreateOptionDto = { name: '', rightAnswer: false };
    questions[qIndex].answers = [...questions[qIndex].answers, newOption];
    setTestData({ ...testData, questions });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const questions = [...testData.questions];
    questions[qIndex].answers.splice(oIndex, 1);
    setTestData({ ...testData, questions });
  };

  const updateOption = (qIndex: number, oIndex: number, field: keyof CreateOptionDto, value: any) => {
    const questions = [...testData.questions];
    const question = questions[qIndex];
    
    if (field === 'rightAnswer' && question.type === 'OPTIONS' && value === true) {
      // If single choice, uncheck other options
      question.answers = question.answers.map((opt, i) => ({
        ...opt,
        rightAnswer: i === oIndex
      }));
    } else {
      question.answers[oIndex] = { ...question.answers[oIndex], [field]: value };
    }
    
    setTestData({ ...testData, questions });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('tests.createTitle')}>
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('tests.name')}</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={testData.name}
              onChange={(e) => setTestData({ ...testData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('common.description')}</label>
            <textarea
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={testData.description}
              onChange={(e) => setTestData({ ...testData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('tests.duration')}</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={testData.duration}
                onChange={(e) => setTestData({ ...testData, duration: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('tests.minRightAnswers')}</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={testData.minRightAnswers}
                onChange={(e) => setTestData({ ...testData, minRightAnswers: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('tests.attempts')}</label>
              <input
                type="number"
                min="1"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={testData.attempts}
                onChange={(e) => setTestData({ ...testData, attempts: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-t pt-4">
            <h4 className="text-md font-semibold text-gray-900">{t('tests.questions')}</h4>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              + {t('tests.addQuestion')}
            </button>
          </div>

          {testData.questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4 rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('tests.questionName')}</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={q.name}
                      onChange={(e) => updateQuestion(qIndex, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('tests.questionType')}</label>
                    <select
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={q.type}
                      onChange={(e) => updateQuestion(qIndex, 'type', e.target.value as QuestionType)}
                    >
                      <option value="OPTIONS">{t('tests.type.OPTIONS')}</option>
                      <option value="OPTIONS_MULTIPLY">{t('tests.type.OPTIONS_MULTIPLY')}</option>
                      <option value="WRITING">{t('tests.type.WRITING')}</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {q.type !== 'WRITING' && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{t('tests.options')}</label>
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      + {t('tests.addOption')}
                    </button>
                  </div>
                  {q.answers.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type={q.type === 'OPTIONS' ? 'radio' : 'checkbox'}
                        checked={opt.rightAnswer}
                        onChange={(e) => updateOption(qIndex, oIndex, 'rightAnswer', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder={t('tests.optionName')}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                        value={opt.name}
                        onChange={(e) => updateOption(qIndex, oIndex, 'name', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {t('common.back')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? t('tests.creating') : t('tests.create')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
