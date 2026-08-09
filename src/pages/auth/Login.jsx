import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, KeyRound } from 'lucide-react';
import { Button, Input, Card } from '../../components/common';
import { authApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './Auth.css';

export default function Login() {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: 'Email is required.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.requestOtp(email);
      notifySuccess('OTP sent — check your inbox.');
      setStep('otp');
      setErrors({});
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrors({ otp: 'Enter the code we sent you.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await authApi.verifyOtp(email, Number(otp));
      login(data.user);
      notifySuccess('Welcome back!');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ak-auth">
      <Card className="ak-auth__card fade-in">
        <div className="ak-auth__header">
          <h1 className="ak-auth__title">{step === 'email' ? 'Welcome to Akademiya' : 'Check your email'}</h1>
          <p className="ak-auth__subtitle">
            {step === 'email'
              ? 'Sign in with your email — no password needed.'
              : `We sent a one-time code to ${email}.`}
          </p>
        </div>

        {step === 'email' ? (
          <form className="ak-auth__form" onSubmit={handleRequestOtp}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoFocus
            />
            <Button type="submit" fullWidth isLoading={isSubmitting} icon={<Mail size={18} />}>
              Send code
            </Button>
          </form>
        ) : (
          <form className="ak-auth__form" onSubmit={handleVerifyOtp}>
            <Input
              label="One-time code"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={errors.otp}
              autoFocus
            />
            <Button type="submit" fullWidth isLoading={isSubmitting} icon={<KeyRound size={18} />}>
              Verify & continue
            </Button>
          </form>
        )}

        <div className="ak-auth__footer">
          {step === 'otp' ? (
            <button className="ak-auth__link" onClick={() => setStep('email')}>
              Use a different email
            </button>
          ) : (
            <span>We'll email you a one-time code to sign in.</span>
          )}
        </div>
      </Card>
    </div>
  );
}
