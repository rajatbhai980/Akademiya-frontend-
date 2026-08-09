import './EmptyState.css';

export default function EmptyState({ title, description, action = null, icon = null }) {
  return (
    <div className="ak-empty fade-in">
      {icon && <div className="ak-empty__icon">{icon}</div>}
      <h3 className="ak-empty__title">{title}</h3>
      {description && <p className="ak-empty__description">{description}</p>}
      {action && <div className="ak-empty__action">{action}</div>}
    </div>
  );
}
