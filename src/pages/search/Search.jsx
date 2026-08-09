import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Loader, EmptyState, Badge } from '../../components/common';
import { searchScholars } from '../../api/profile';
import { useNotification } from '../../hooks/useNotification';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notifyError } = useNotification();

  const activeQuery = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || 1);

  const [draft, setDraft] = useState(activeQuery);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDraft(activeQuery);
  }, [activeQuery]);

  const runSearch = useCallback(() => {
    if (!activeQuery.trim()) {
      setResults([]);
      setCount(0);
      return;
    }
    setIsLoading(true);
    searchScholars(activeQuery, page)
      .then(({ data }) => {
        setResults(data.results || []);
        setCount(data.count || 0);
        setHasNext(Boolean(data.next));
        setHasPrev(Boolean(data.previous));
      })
      .catch((err) => notifyError(err.message))
      .finally(() => setIsLoading(false));
  }, [activeQuery, page, notifyError]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    setSearchParams({ q, page: '1' });
  };

  const handleClear = () => {
    setDraft('');
    setSearchParams({});
  };

  const goToPage = (nextPage) => {
    setSearchParams({ q: activeQuery, page: String(nextPage) });
  };

  return (
    <div className="fade-in ak-search">
      {!activeQuery.trim() && (
        <EmptyState
          title="Search for scholars"
          description="Type a username or keyword above and press Search."
        />
      )}

      {activeQuery.trim() && isLoading && <Loader label="Searching" />}

      {activeQuery.trim() && !isLoading && !results.length && (
        <EmptyState
          title={`No results for "${activeQuery}"`}
          description="Try a different username or keyword."
        />
      )}

      {activeQuery.trim() && !isLoading && results.length > 0 && (
        <>
          <div className="ak-search__meta-row">
            <h2>
              Results for "{activeQuery}" <span className="text-muted">({count})</span>
            </h2>
          </div>

          <div className="ak-search__grid">
            {results.map((scholar) => (
              <Card
                key={scholar.id}
                className="ak-search__card"
                onClick={() => navigate(`/profile/${scholar.id}`)}
              >
                <img
                  className="ak-search__avatar"
                  src={scholar.photo || 'https://placehold.co/64x64?text=%20'}
                  alt={scholar.username}
                />
                <div>
                  <div className="ak-search__username">{scholar.username}</div>
                  <div className="ak-search__meta">
                    {scholar.semester && <span>Semester {scholar.semester}</span>}
                    {scholar.subscribed && <Badge tone="success">Subscribed</Badge>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="ak-search__pagination">
            <button disabled={!hasPrev} onClick={() => goToPage(page - 1)} aria-label="Previous page">
              <ChevronLeft size={18} />
            </button>
            <span>Page {page}</span>
            <button disabled={!hasNext} onClick={() => goToPage(page + 1)} aria-label="Next page">
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}