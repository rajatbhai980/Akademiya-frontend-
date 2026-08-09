import { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { Card, Loader, EmptyState } from '../../components/common';
import { leaderboardApi } from '../../api';
import { useNotification } from '../../hooks/useNotification';
import './Leaderboard.css';

export default function Leaderboard() {
  const { notifyError } = useNotification();
  const [scholars, setScholars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leaderboardApi
      .fetchLeaderboard()
      .then(({ data }) => setScholars(data))
      .catch((err) => notifyError(err.message))
      .finally(() => setIsLoading(false));
  }, [notifyError]);

  if (isLoading) return <Loader fullPage label="Loading leaderboard" />;

  return (
    <div className="ak-leaderboard fade-in">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Trophy size={28} style={{ color: 'var(--color-primary)' }} /> Leaderboard
      </h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Top 10 scholars by level.
      </p>

      {scholars.length === 0 ? (
        <EmptyState title="No rankings yet" description="Play a quiz to be the first on the board." />
      ) : (
        <Card>
          {scholars.map((s, i) => (
            <div key={`${s.username}-${i}`} className="ak-leaderboard__row">
              <span className="ak-leaderboard__rank">
                {i < 3 ? <Medal size={20} className={`ak-leaderboard__medal ak-leaderboard__medal--${i}`} /> : i + 1}
              </span>
              <span className="ak-leaderboard__name">{s.username}</span>
              <span className="ak-leaderboard__level">Level {s.level}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
