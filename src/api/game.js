import axiosClient from './axiosClient';

/**
 * Begin a game session.
 * payload shapes (see API_CONTRACT.md):
 *  select: { mode: 'select', subject: { id, pages }, order }
 *  custom: { mode: 'custom', subjects: [{ id, pages }], order }
 *  all:    { mode: 'all', pages, order }
 */
export const startGame = (payload) => axiosClient.post('/game/start/', payload);

export const fetchSemesters = () => axiosClient.get('/game/semesters/');

export const fetchSubjects = (semesterId) => axiosClient.get(`/game/subjects/${semesterId}/`);

/** subjects: [{ subject_name, id }] */
export const fetchPageCounts = (subjects) =>
  axiosClient.post('/game/pages_counts/', { subjects });

/** answers: [{ answer_id }] */
export const submitAnswer = (gameSessionId, answers) =>
  axiosClient.post('/game/submit_answer/', { game_session_id: gameSessionId, answers });

export const fetchQuestionPages = (gameSessionId) =>
  axiosClient.get(`/game/view_question_pages/${gameSessionId}/`);

export const fetchQuestionPage = (pageId) =>
  axiosClient.get(`/game/view_question_page/${pageId}/`);

/** Finalize the session, updating scholar performance. Requires auth. */
export const displayAndUpdatePerformance = () =>
  axiosClient.post('/game/display_and_update_performance/');
