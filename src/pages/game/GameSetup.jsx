import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Layers, Globe } from 'lucide-react';
import { Card, Button, Loader } from '../../components/common';
import { gameApi } from '../../api';
import { useNotification } from '../../hooks/useNotification';
import './Game.css';

const MODES = [
  { id: 'select', label: 'Single subject', icon: BookOpen },
  { id: 'custom', label: 'Custom mix', icon: Layers },
  { id: 'all', label: 'Everything', icon: Globe },
];

export default function GameSetup() {
  const { notifyError } = useNotification();
  const navigate = useNavigate();

  const [mode, setMode] = useState('select');
  const [order, setOrder] = useState('desc');
  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [pageCounts, setPageCounts] = useState({});
  const [pagesPerSubject, setPagesPerSubject] = useState({});
  const [allPages, setAllPages] = useState(5);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    gameApi
      .fetchSemesters()
      .then(({ data }) => setSemesters(data))
      .catch((err) => notifyError(err.message));
  }, [notifyError]);

  useEffect(() => {
    if (!semesterId) {
      setSubjects([]);
      return;
    }
    setIsLoadingSubjects(true);
    gameApi
      .fetchSubjects(semesterId)
      .then(({ data }) => setSubjects(data))
      .catch((err) => notifyError(err.message))
      .finally(() => setIsLoadingSubjects(false));
  }, [semesterId, notifyError]);

  useEffect(() => {
    if (!subjects.length || mode === 'all') return;
    const subjectsPayload = subjects.map((s) => ({ subject_name: s.name, id: s.id }));
    gameApi
      .fetchPageCounts(subjectsPayload)
      .then(({ data }) => setPageCounts(data))
      .catch(() => {});
  }, [subjects, mode]);

  const toggleSubject = (id) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      let payload;
      if (mode === 'select') {
        const subject = subjects.find((s) => s.id === selectedSubjectIds[0]);
        if (!subject) throw new Error('Pick a subject to start.');
        payload = {
          mode: 'select',
          subject: { id: subject.id, pages: pagesPerSubject[subject.id] || 1 },
          order,
        };
      } else if (mode === 'custom') {
        if (!selectedSubjectIds.length) throw new Error('Pick at least one subject.');
        payload = {
          mode: 'custom',
          subjects: selectedSubjectIds.map((id) => ({ id, pages: pagesPerSubject[id] || 1 })),
          order,
        };
      } else {
        payload = { mode: 'all', pages: allPages, order };
      }

      const { data } = await gameApi.startGame(payload);
      navigate(`/play/session/${data.session_id}`);
    } catch (err) {
      notifyError(err.message || err.data?.detail || 'Could not start the game.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="ak-game-setup fade-in">
      <h1>Set up your quiz</h1>
      <p className="text-muted">Pick how you'd like to play.</p>

      <div className="ak-game-setup__modes">
        {MODES.map(({ id, label, icon: Icon }) => (
          <Card
            key={id}
            hoverable
            className={`ak-mode-card ${mode === id ? 'ak-mode-card--active' : ''}`}
            onClick={() => setMode(id)}
          >
            <Icon size={24} style={{ color: 'var(--color-primary)' }} />
            <p style={{ marginTop: 8, fontWeight: 600 }}>{label}</p>
          </Card>
        ))}
      </div>

      {mode !== 'all' && (
        <Card style={{ marginBottom: 16 }}>
          <label className="ak-field__label">Semester</label>
          <select
            className="ak-field__input"
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
              setSelectedSubjectIds([]);
            }}
            style={{ marginTop: 8, marginBottom: 16 }}
          >
            <option value="">Choose a semester</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {isLoadingSubjects ? (
            <Loader label="Loading subjects" />
          ) : (
            subjects.map((subject) => {
              const checked = selectedSubjectIds.includes(subject.id);
              const maxPages = pageCounts[subject.name] || 10;
              return (
                <div key={subject.id} className="ak-subject-row">
                  <input
                    type={mode === 'select' ? 'radio' : 'checkbox'}
                    name="subject"
                    checked={checked}
                    onChange={() =>
                      mode === 'select' ? setSelectedSubjectIds([subject.id]) : toggleSubject(subject.id)
                    }
                  />
                  <span className="ak-subject-row__name">{subject.name}</span>
                  {checked && (
                    <input
                      type="number"
                      min={1}
                      max={maxPages}
                      value={pagesPerSubject[subject.id] || 1}
                      onChange={(e) =>
                        setPagesPerSubject((prev) => ({ ...prev, [subject.id]: Number(e.target.value) }))
                      }
                      style={{ width: 64 }}
                      className="ak-field__input"
                    />
                  )}
                </div>
              );
            })
          )}
        </Card>
      )}

      {mode === 'all' && (
        <Card style={{ marginBottom: 16 }}>
          <label className="ak-field__label">Pages</label>
          <input
            type="number"
            min={1}
            className="ak-field__input"
            value={allPages}
            onChange={(e) => setAllPages(Number(e.target.value))}
            style={{ marginTop: 8 }}
          />
        </Card>
      )}

      <Card style={{ marginBottom: 24 }}>
        <label className="ak-field__label">Order</label>
        <select
          className="ak-field__input"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{ marginTop: 8 }}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </Card>

      <Button size="lg" fullWidth icon={<Play size={20} />} isLoading={isStarting} onClick={handleStart}>
        Start quiz
      </Button>
    </div>
  );
}
