import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Card, Button } from '../../components/common';
import './Game.css';

export default function GameResults() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const correct = state?.correct ?? 0;
  const attempted = state?.attempted ?? 0;
  const ratio = attempted ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div className="ak-results fade-in">
      <Trophy size={48} style={{ color: 'var(--color-primary)' }} />
      <h1 style={{ marginTop: 16 }}>Quiz complete!</h1>
      <div className="ak-results__score">{ratio}%</div>
      <p className="text-muted">
        You got {correct} out of {attempted} questions right.
      </p>

      <div className="ak-results__stats">
        <Card>
          <div className="ak-profile__stat-value">{correct}</div>
          <div className="ak-profile__stat-label">Correct</div>
        </Card>
        <Card>
          <div className="ak-profile__stat-value">{attempted - correct}</div>
          <div className="ak-profile__stat-label">Missed</div>
        </Card>
        <Card>
          <div className="ak-profile__stat-value">{attempted}</div>
          <div className="ak-profile__stat-label">Total</div>
        </Card>
      </div>

      <div className="ak-results__actions">
        <Button icon={<RotateCcw size={18} />} onClick={() => navigate('/play')}>
          Play again
        </Button>
        <Button variant="ghost" icon={<Home size={18} />} onClick={() => navigate('/')}>
          Go home
        </Button>
      </div>
    </div>
  );
}
