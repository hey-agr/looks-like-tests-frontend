export interface TestResource {
  id: number;
  name: string;
  description?: string;
  duration?: number;
  minRightAnswers?: number;
  attempts?: number;
  isNeedVerify?: boolean;
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
  testProgresses: any[]; // We can refine this if needed, but for now any[] is fine
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
  testResultStatus: 'PASS' | 'FAIL' | 'PENDING'; // Assuming these statuses based on common sense
}

export interface StudentTestHistoryCollectionResource {
  tests: StudentTestHistoryResource[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
