import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { Card, Input, Button } from '../../components/common';
import { profileApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './Profile.css';

export default function EditProfile() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', semester: '', bio: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    profileApi
      .fetchProfile(user.id)
      .then(({ data }) =>
        setForm({
          username: data.profile_info.username || '',
          semester: data.profile_info.semester || '',
          bio: data.profile_info.bio || '',
        })
      )
      .catch((err) => notifyError(err.message));
  }, [user, notifyError]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...form };
      if (photoFile) payload.photo = photoFile;
      await profileApi.updateProfile(payload);
      notifySuccess('Profile updated.');
      navigate(`/profile/${user.id}`);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: '0 auto', padding: '48px 0' }}>
      <Card>
        <h2 style={{ marginBottom: 20 }}>Edit profile</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Username" value={form.username} onChange={handleChange('username')} />
          <Input
            label="Semester"
            type="number"
            value={form.semester}
            onChange={handleChange('semester')}
          />
          <div className="ak-field">
            <label className="ak-field__label" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="ak-field__input"
              rows={4}
              value={form.bio}
              onChange={handleChange('bio')}
            />
          </div>
          <Input
            label="Profile photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />
          <Button type="submit" isLoading={isSubmitting} icon={<Save size={18} />}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
