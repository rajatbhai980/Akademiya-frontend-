import './Loader.css';

export default function Loader({ label = 'Loading', size = 'md', fullPage = false }) {
  const content = (
    <div className={`ak-loader ak-loader--${size}`} role="status" aria-live="polite">
      <span className="ak-loader__ring" />
      {label && <span className="ak-loader__label">{label}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="ak-loader__page">{content}</div>;
  }
  return content;
}
