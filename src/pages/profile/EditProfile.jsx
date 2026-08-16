import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Camera } from 'lucide-react';
import { Card, Input, Button } from '../../components/common';
import { profileApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './Profile.css';

export default function EditProfile() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: null, semester: null, bio: null, photo: null });
  const [originalForm, setOriginalForm] = useState(null); // NEW: snapshot to diff against
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    profileApi
      .fetchProfile(user.id)
      .then(({ data }) => {
        const loaded = {
          username: data.profile_info.username || null,
          semester: data.profile_info.semester || null,
          bio: data.profile_info.bio || null,
          photo: data.profile_info.photo || null,
        };
        setForm(loaded);
        setOriginalForm(loaded); // NEW: keep the baseline
      })
      .catch((err) => notifyError(err.message));
  }, [user, notifyError]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
  };

  // NEW: dirty check — a new photo file always counts as a change,
  // otherwise compare each text field against the loaded snapshot
  const isDirty =
    !!photoFile ||
    (originalForm !== null &&
      (form.username !== originalForm.username ||
        String(form.semester) !== String(originalForm.semester) ||
        form.bio !== originalForm.bio));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...form };
      photoFile ? payload.photo = photoFile: payload.photo = null; 
      await profileApi.updateProfile(payload);
      notifySuccess('Profile updated.');
      navigate(`/profile/${user.id}`);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarSrc = photoPreview || form.photo || null;

  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: '0 auto', padding: '48px 0' }}>
      <Card>
        <h2 style={{ marginBottom: 20 }}>Edit profile</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Avatar + upload, moved to the top */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <label
              htmlFor="photo-upload"
              style={{
                position: 'relative',
                width: 96,
                height: 96,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'block',
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-border)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    background: 'var(--color-primary-tint)',
                    color: 'var(--color-primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    fontWeight: 700,
                    border: '2px solid var(--color-border)',
                  }}
                >
                  {(form.username || '?').charAt(0).toUpperCase()}
                </div>
              )}

              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--color-surface)',
                  transition: 'transform var(--duration-base) var(--ease-standard)',
                }}
                className="ak-avatar-camera"
              >
                <Camera size={14} />
              </span>

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ display: 'none' }}
              />
            </label>
          </div>

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

          <Button type="submit" disabled={isSubmitting || !isDirty} isLoading={isSubmitting} icon={<Save size={18} />}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}