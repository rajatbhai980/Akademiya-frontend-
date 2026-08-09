import './Badge.css';

/** tone: 'primary' | 'neutral' | 'success' | 'error' */
export default function Badge({ children, tone = 'primary', icon = null }) {
  return (
    <span className={`ak-badge ak-badge--${tone}`}>
      {icon && <span className="ak-badge__icon">{icon}</span>}
      {children}
    </span>
  );
}
