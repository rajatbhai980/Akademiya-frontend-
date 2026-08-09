import { useEffect, useState } from 'react';
import { Gem, ShieldCheck, Check } from 'lucide-react';
import { Card, Button, Badge } from '../../components/common';
import { storeApi, profileApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './Store.css';

const PERKS = [
  'Unlimited quiz pages per session',
  'Priority leaderboard badge',
  'Early access to new subjects',
];

export default function Store() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [scholar, setScholar] = useState(null);

  const loadProfile = () => {
    if (!user) return;
    profileApi
      .fetchProfile(user.id)
      .then(({ data }) => setScholar(data.profile_info))
      .catch(() => {});
  };

  useEffect(loadProfile, [user]);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const { data } = await storeApi.purchaseSubscription();
      notifySuccess(data.subscribed ? 'Subscription active — enjoy the perks!' : 'Already subscribed.');
      loadProfile();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="ak-store fade-in">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Gem size={26} style={{ color: 'var(--color-primary)' }} /> Store
      </h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Spend the gems you've earned playing quizzes.
      </p>

      <Card className="ak-store__card">
        <div className="ak-store__header">
          <ShieldCheck size={32} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3>Akademiya Subscription</h3>
            <p className="text-muted">700 gems</p>
          </div>
        </div>

        <ul className="ak-store__perks">
          {PERKS.map((perk) => (
            <li key={perk}>
              <Check size={16} style={{ color: 'var(--color-primary)' }} /> {perk}
            </li>
          ))}
        </ul>

        <div className="ak-store__footer">
          <span>
            Your balance: <strong>{scholar?.gems ?? '—'}</strong> gems
          </span>
          {scholar?.subscribed ? (
            <Badge tone="success">Subscribed</Badge>
          ) : (
            <Button isLoading={isPurchasing} onClick={handlePurchase}>
              Subscribe for 700 gems
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
