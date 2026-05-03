export interface OptionResource {
  id: number;
  name: string;
}

export interface QuestionResource {
  id: number;
  name: string;
  type: QuestionType;
  answers: OptionResource[];
}

export interface TestResource {
  id: number;
  name: string;
  description?: string;
  duration?: number;
  minRightAnswers?: number;
  attempts?: number;
  isNeedVerify?: boolean;
  questions?: QuestionResource[];
}

export interface TestCollectionResource {
  tests: TestResource[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface StudentTestAssignationResource {
  testId: number;
  name: string;
  description: string;
  minCorrectAnswers: number;
  questionsCount: number;
  attempts: number;
  duration: number;
  isNeedVerify: boolean;
  testProgresses: TestProgressResource[];
}

export interface StudentTestAssignationCollectionResource {
  tests: StudentTestAssignationResource[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface StudentTestHistoryResource {
  testId: number;
  name: string;
  description: string;
  testProgressId: number;
  dateStarted: string;
  dateFinished: string;
  questionCount: number;
  rightAnswersCount: number;
  pendingAnswersCount: number;
  wrongAnswersCount: number;
  testResultStatus: 'IN_PROGRESS' | 'PASSED' | 'PENDING' | 'FAILED';
}

export interface TestResultResource {
  testProgressId: number;
  questionCount: number;
  rightAnswersCount: number;
  pendingAnswersCount: number;
  wrongAnswersCount: number;
  expired: boolean;
  testResultStatus: 'IN_PROGRESS' | 'PASSED' | 'PENDING' | 'FAILED';
}

export interface TestProgressResource {
  id: number;
  userId: number;
  testId: number;
  dateStarted: string;
  dateFinished?: string;
  testResult?: TestResultResource;
}

export interface CreateTestAnswerDto {
  questionId: number;
  optionIds?: number[];
  textAnswer?: string;
}

export interface CreateTestAnswersDto {
  answers: CreateTestAnswerDto[];
}

export type QuestionType = 'OPTIONS' | 'OPTIONS_MULTIPLY' | 'WRITING';

export interface CreateOptionDto {
  name: string;
  rightAnswer: boolean;
}

export interface CreateQuestionDto {
  name: string;
  type: QuestionType;
  answers: CreateOptionDto[];
  // images?: any[]; // Skipping images for now as it might require file upload logic
}

export interface CreateTestDto {
  name: string;
  description?: string;
  duration?: number;
  minRightAnswers?: number;
  attempts?: number;
  questions: CreateQuestionDto[];
}

export interface StudentTestHistoryCollectionResource {
  tests: StudentTestHistoryResource[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
