import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, Button, Loader, EmptyState } from '../../components/common';
import { gameApi } from '../../api';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import './Game.css';

export default function GamePlay() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { notifyError } = useNotification();
  const { isAuthenticated } = useAuth();

  const [pages, setPages] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDetail, setPageDetail] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: answerId }
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totals, setTotals] = useState({ correct: 0, attempted: 0 });

  useEffect(() => {
    gameApi
      .fetchQuestionPages(sessionId)
      .then(({ data }) => setPages(data))
      .catch((err) => notifyError(err.message))
      .finally(() => setIsLoading(false));
  }, [sessionId, notifyError]);

  useEffect(() => {
    const currentPage = pages[pageIndex];
    if (!currentPage) return;
    setIsLoading(true);
    setSelectedAnswers({});
    gameApi
      .fetchQuestionPage(currentPage.id)
      .then(({ data }) => setPageDetail(data))
      .catch((err) => notifyError(err.message))
      .finally(() => setIsLoading(false));
  }, [pages, pageIndex, notifyError]);

  const handleSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const allAnswered =
    pageDetail?.questions?.length > 0 &&
    pageDetail.questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      const answers = Object.values(selectedAnswers).map((answer_id) => ({ answer_id }));
      const { data } = await gameApi.submitAnswer(sessionId, answers);
      setTotals((t) => ({
        correct: t.correct + (data.correct_answers || 0),
        attempted: t.attempted + (pageDetail?.questions?.length || 0),
      }));

      if (pageIndex + 1 < pages.length) {
        setPageIndex((i) => i + 1);
      } else {
        if (isAuthenticated) {
          try {
            await gameApi.displayAndUpdatePerformance();
          } catch {
            // Non-fatal: still show local results even if performance sync fails.
          }
        }
        navigate('/play/results', {
          state: {
            correct: totals.correct + (data.correct_answers || 0),
            attempted: totals.attempted + (pageDetail?.questions?.length || 0),
          },
        });
      }
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !pageDetail) return <Loader fullPage label="Loading your quiz" />;

  if (!pages.length) {
    return (
      <EmptyState
        title="No questions found"
        description="This session has no question pages. Try starting a new quiz."
        action={<Button onClick={() => navigate('/play')}>Back to setup</Button>}
      />
    );
  }

  return (
    <div className="ak-play fade-in">
      <div className="ak-play__progress">
        <span>
          Page {pageIndex + 1} of {pages.length}
        </span>
        <span>{pageDetail?.subject?.name}</span>
      </div>
      <div className="ak-play__progress-bar">
        <div
          className="ak-play__progress-fill"
          style={{ width: `${((pageIndex + 1) / pages.length) * 100}%` }}
        />
      </div>

      {pageDetail?.questions?.map((q) => (
        <Card key={q.id} style={{ marginBottom: 20 }}>
          <p className="ak-question__text">{q.description}</p>
          {q.hint && <p className="ak-question__hint">Hint: {q.hint}</p>}
          <div className="ak-answers">
            {q.answers.map((a) => (
              <div
                key={a.id}
                className={`ak-answer ${selectedAnswers[q.id] === a.id ? 'ak-answer--selected' : ''}`}
                onClick={() => handleSelect(q.id, a.id)}
              >
                <span className="ak-answer__radio" />
                <span>{a.description}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="ak-play__footer">
        <Button
          icon={<ChevronRight size={18} />}
          disabled={!allAnswered}
          isLoading={isSubmitting}
          onClick={handleNext}
        >
          {pageIndex + 1 < pages.length ? 'Next page' : 'Finish quiz'}
        </Button>
      </div>
    </div>
  );
}
