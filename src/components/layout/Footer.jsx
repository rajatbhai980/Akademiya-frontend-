import './Footer.css';

export default function Footer() {
  return (
    <footer className="ak-footer">
      <div className="page-container ak-footer__inner">
        <span>© {new Date().getFullYear()} Akademiya</span>
        <span className="text-muted">Learn. Play. Level up.</span>
      </div>
    </footer>
  );
}
