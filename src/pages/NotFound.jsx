import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button, EmptyState } from '../components/common';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '64px 0' }}>
      <EmptyState
        icon={<Compass size={40} />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={<Button onClick={() => navigate('/')}>Back home</Button>}
      />
    </div>
  );
}
