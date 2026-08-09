import { useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, Sparkles } from 'lucide-react';
import { Button, Card } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="ak-home fade-in">
      <section className="ak-home__hero">
        <span className="ak-home__eyebrow">
          <Sparkles size={16} /> Learn by playing
        </span>
        <h1 className="ak-home__title">
          Turn your syllabus into a<br /> game you actually want to play.
        </h1>
        <p className="ak-home__subtitle">
          Pick a subject, answer questions, earn experience, and climb the leaderboard —
          {isAuthenticated ? ` welcome back, ${user?.username}.` : ' create a free account to save your progress.'}
        </p>
        <div className="ak-home__actions">
          <Button size="lg" icon={<Gamepad2 size={20} />} onClick={() => navigate('/play')}>
            Start playing
          </Button>
          <Button size="lg" variant="ghost" icon={<Trophy size={20} />} onClick={() => navigate('/leaderboard')}>
            View leaderboard
          </Button>
        </div>
      </section>

      <section className="ak-home__grid">
        <Card hoverable onClick={() => navigate('/play')}>
          <h3>Play a quiz</h3>
          <p className="text-muted">Choose one subject, a custom mix, or all of them at once.</p>
        </Card>
        <Card hoverable onClick={() => navigate('/leaderboard')}>
          <h3>Leaderboard</h3>
          <p className="text-muted">See how you stack up against the top 10 scholars.</p>
        </Card>
        <Card hoverable onClick={() => navigate('/store')}>
          <h3>Store</h3>
          <p className="text-muted">Spend gems you've earned on a subscription upgrade.</p>
        </Card>
      </section>
    </div>
  );
}
