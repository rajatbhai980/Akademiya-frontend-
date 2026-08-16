import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Gem, Star, Trophy } from 'lucide-react';
import { Card, Badge, Button, Loader, EmptyState } from '../../components/common';
import { profileApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './Profile.css';
import {BASE_URL} from "../../api/axiosClient";

export default function Profile() {
  const { pk } = useParams();
  const { user } = useAuth();
  const { notifyError } = useNotification();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileId = pk || user?.id;
  const isOwnProfile = user && Number(profileId) === Number(user.id);

  useEffect(() => {
    if (!profileId) return;
    setIsLoading(true);
    profileApi
      .fetchProfile(profileId)
      .then(({ data }) => setProfile(data))
      .catch((err) => notifyError(err.message))
      .finally(() => setIsLoading(false));
  }, [profileId, notifyError]);

  if (isLoading) return <Loader fullPage label="Loading profile" />;

  if (!profile) {
    return (
      <EmptyState
        title="Profile not found"
        description="This scholar doesn't exist or has been removed."
        action={<Button onClick={() => navigate('/')}>Go home</Button>}
      />
    );
  }

  const { profile_info: info, performance_info: perf, follower_count, followee_count, followers, followees } = profile;

  return (
    <div className="fade-in">
      <div className="ak-profile__header">
        <img
          className="ak-profile__avatar"
          src={info.photo || 'https://placehold.co/96x96?text=%20'}
          alt={info.username}
        />
        <div>
          <h1 className="ak-profile__name">{info.username}</h1>
          {info.bio && <p className="ak-profile__bio">{info.bio}</p>}
          <div className="ak-profile__badges">
            {info.semester && <Badge tone="primary">Semester {info.semester}</Badge>}
            {info.subscribed && <Badge tone="success">Subscribed</Badge>}
            {info.is_staff && <Badge tone="neutral">Staff</Badge>}
          </div>
        </div>
        {isOwnProfile && (
          <div className="ak-profile__actions">
            <Button variant="secondary" icon={<Pencil size={16} />} onClick={() => navigate('/profile/edit')}>
              Edit profile
            </Button>
          </div>
        )}
      </div>

      <div className="ak-profile__stats">
        <Card>
          <div className="ak-profile__stat-value">
            <Gem size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {info.gems}
          </div>
          <div className="ak-profile__stat-label">Gems</div>
        </Card>
        <Card>
          <div className="ak-profile__stat-value">
            <Star size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {perf.level}
          </div>
          <div className="ak-profile__stat-label">Level · {perf.experience} XP</div>
        </Card>
        <Card>
          <div className="ak-profile__stat-value">
            <Trophy size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {perf.correct_ratio?.toFixed ? perf.correct_ratio.toFixed(1) : perf.correct_ratio}%
          </div>
          <div className="ak-profile__stat-label">
            {perf.correct}/{perf.attempted} correct
          </div>
        </Card>
      </div>

      <div className="ak-profile__connections">
        <Card>
          <h3>Followers ({follower_count})</h3>
          {followers?.length ? (
            followers.map((f) => (
              <div key={f.id} className="ak-profile__list-item">
                {f.username}
              </div>
            ))
          ) : (
            <p className="text-muted">No followers yet.</p>
          )}
        </Card>
        <Card>
          <h3>Following ({followee_count})</h3>
          {followees?.length ? (
            followees.map((f) => (
              <div key={f.id} className="ak-profile__list-item">
                {f.username}
              </div>
            ))
          ) : (
            <p className="text-muted">Not following anyone yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
