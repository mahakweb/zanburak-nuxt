import axiosInstance from '@/store/axiosInstance';

// ── Admin: Quizzes ──────────────────────────────────────────────
export async function listQuizzes(params = {}) {
  const r = await axiosInstance.get('/admin/quizzes', { params });
  return r.data;
}

export async function getQuiz(id) {
  const r = await axiosInstance.get(`/admin/quizzes/${id}`);
  return r.data;
}

export async function createQuiz(payload) {
  const r = await axiosInstance.post('/admin/quizzes', payload);
  return r.data;
}

export async function updateQuiz(id, payload) {
  const r = await axiosInstance.post(`/admin/quizzes/${id}/update`, payload);
  return r.data;
}

export async function deleteQuiz(id) {
  const r = await axiosInstance.delete(`/admin/quizzes/${id}`);
  return r.data;
}

export async function getQuizReportSummary(quizId) {
  const r = await axiosInstance.get(`/admin/quizzes/${quizId}/reports/summary`);
  return r.data;
}

export async function getQuizPassedStudents(quizId, params = {}) {
  const r = await axiosInstance.get(`/admin/quizzes/${quizId}/reports/passed`, { params });
  return r.data;
}

export async function getQuizFailedStudents(quizId, params = {}) {
  const r = await axiosInstance.get(`/admin/quizzes/${quizId}/reports/failed`, { params });
  return r.data;
}

export async function getQuizReviewQueue(quizId) {
  const r = await axiosInstance.get(`/admin/quizzes/${quizId}/reports/review-queue`);
  return r.data;
}

export async function getCourseQuizzes(courseId) {
  const r = await axiosInstance.get(`/admin/quizzes/for-course/${courseId}`);
  return r.data;
}

export async function getSectionQuizzes(sectionId) {
  const r = await axiosInstance.get(`/admin/quizzes/for-section/${sectionId}`);
  return r.data;
}

export async function getEpisodeQuizzes(episodeId) {
  const r = await axiosInstance.get(`/admin/quizzes/for-episode/${episodeId}`);
  return r.data;
}

export async function getEntityQuizzes(entityType, entityId) {
  if (entityType === 'section') return getSectionQuizzes(entityId);
  if (entityType === 'episode') return getEpisodeQuizzes(entityId);
  return getCourseQuizzes(entityId);
}

export async function gradeAttemptAnswer(answerId, payload) {
  const r = await axiosInstance.post(`/admin/quizzes/attempt-answers/${answerId}/grade`, payload);
  return r.data;
}

export async function gradeAttemptAnswers(attemptId, grades) {
  const r = await axiosInstance.post(`/admin/quizzes/attempts/${attemptId}/grade-answers`, { grades });
  return r.data;
}

export async function completeAttemptReview(attemptId) {
  const r = await axiosInstance.post(`/admin/quizzes/attempts/${attemptId}/complete-review`);
  return r.data;
}

// ── Admin: Question Bank ────────────────────────────────────────
export async function listQuizQuestions(params = {}) {
  const r = await axiosInstance.get('/admin/quiz-questions', { params });
  return r.data;
}

export async function getQuizQuestion(id) {
  const r = await axiosInstance.get(`/admin/quiz-questions/${id}`);
  return r.data;
}

export async function createQuizQuestion(payload) {
  const r = await axiosInstance.post('/admin/quiz-questions', payload);
  return r.data;
}

export async function updateQuizQuestion(id, payload) {
  const r = await axiosInstance.post(`/admin/quiz-questions/${id}/update`, payload);
  return r.data;
}

export async function deleteQuizQuestion(id) {
  const r = await axiosInstance.delete(`/admin/quiz-questions/${id}`);
  return r.data;
}

export async function listQuestionCategories() {
  const r = await axiosInstance.get('/admin/quiz-questions/categories');
  return r.data;
}

export async function createQuestionCategory(payload) {
  const r = await axiosInstance.post('/admin/quiz-questions/categories', payload);
  return r.data;
}

export async function listQuestionTags() {
  const r = await axiosInstance.get('/admin/quiz-questions/tags');
  return r.data;
}

// ── Student ─────────────────────────────────────────────────────
export async function getStudentQuiz(uuid) {
  const r = await axiosInstance.get(`/quiz/quizzes/${uuid}`);
  return r.data;
}

export async function startQuizAttempt(uuid) {
  const r = await axiosInstance.post(`/quiz/quizzes/${uuid}/start`);
  return r.data;
}

export async function saveQuizProgress(attemptUuid, payload) {
  const r = await axiosInstance.post(`/quiz/attempts/${attemptUuid}/save`, payload);
  return r.data;
}

export async function submitQuizAttempt(attemptUuid, payload) {
  const r = await axiosInstance.post(`/quiz/attempts/${attemptUuid}/submit`, payload);
  return r.data;
}

export async function resumeQuizAttempt(attemptUuid) {
  const r = await axiosInstance.post(`/quiz/attempts/${attemptUuid}/resume`);
  return r.data;
}

export async function getQuizAttemptResult(attemptUuid) {
  const r = await axiosInstance.get(`/quiz/attempts/${attemptUuid}/result`);
  return r.data;
}

export async function getQuizHistory(params = {}) {
  const r = await axiosInstance.get('/quiz/history', { params });
  return r.data;
}

export const QUESTION_TYPE_LABELS = {
  single_choice: 'تک‌گزینه‌ای',
  multiple_choice: 'چندگزینه‌ای',
  true_false: 'درست/غلط',
  short_answer: 'پاسخ کوتاه',
  long_answer: 'پاسخ تشریحی',
  fill_blank: 'جای خالی',
  matching: 'تطبیق',
  ordering: 'مرتب‌سازی',
};

export const DIFFICULTY_LABELS = {
  easy: 'آسان',
  medium: 'متوسط',
  hard: 'سخت',
};

export const QUIZZABLE_TYPES = {
  course: 'دوره',
  section: 'فصل',
  episode: 'درس',
};
