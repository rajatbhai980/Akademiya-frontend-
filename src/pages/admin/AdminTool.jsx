import { useState } from 'react';
import { PlusCircle, Search, Trash2, Save } from 'lucide-react';
import { Card, Button, Input } from '../../components/common';
import { adminApi } from '../../api';
import { useNotification } from '../../hooks/useNotification';
import './Admin.css';

const emptyQuestion = () => ({
  description: '',
  hint: '',
  full_explaination: '',
  answers: [
    { description: '', correct: true },
    { description: '', correct: false },
  ],
});

export default function AdminTool() {
  const { notifySuccess, notifyError } = useNotification();

  // --- Create page state ---
  const [semesterName, setSemesterName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [year, setYear] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [isSaving, setIsSaving] = useState(false);

  // --- Lookup page state ---
  const [lookupYear, setLookupYear] = useState('');
  const [lookupSubjectId, setLookupSubjectId] = useState('');
  const [foundPage, setFoundPage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const updateQuestion = (index, field, value) => {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const updateAnswer = (qIndex, aIndex, field, value) => {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qIndex) return q;
        const answers = q.answers.map((a, j) => {
          if (field === 'correct') {
            return { ...a, correct: j === aIndex };
          }
          return j === aIndex ? { ...a, [field]: value } : a;
        });
        return { ...q, answers };
      })
    );
  };

  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()]);
  const removeQuestion = (index) => setQuestions((qs) => qs.filter((_, i) => i !== index));
  const addAnswer = (qIndex) =>
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIndex ? { ...q, answers: [...q.answers, { description: '', correct: false }] } : q))
    );

  const handleCreatePage = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.enterPage({
        semester: { name: semesterName },
        subject: { name: subjectName },
        question_page: { year },
        question_answers: questions,
      });
      notifySuccess('Page created successfully.');
      setSemesterName('');
      setSubjectName('');
      setYear('');
      setQuestions([emptyQuestion()]);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupYear || !lookupSubjectId) return;
    setIsSearching(true);
    try {
      const { data } = await adminApi.fetchAdminPage(lookupYear, lookupSubjectId);
      setFoundPage(data);
    } catch (err) {
      setFoundPage(null);
      notifyError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!lookupYear || !lookupSubjectId) return;
    try {
      await adminApi.deleteAdminPage(lookupYear, lookupSubjectId);
      notifySuccess('Page deleted.');
      setFoundPage(null);
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div className="ak-admin fade-in">
      <h1>Admin tool</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        Add new question pages, or look up and delete existing ones.
      </p>

      <div className="ak-admin__grid">
        <Card>
          <h3 style={{ marginBottom: 16 }}>Create a page</h3>
          <form onSubmit={handleCreatePage} className="ak-admin__form">
            <Input label="Semester name" value={semesterName} onChange={(e) => setSemesterName(e.target.value)} required />
            <Input label="Subject name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required />
            <Input label="Year (YYYY-MM-DD)" value={year} onChange={(e) => setYear(e.target.value)} required />

            {questions.map((q, qi) => (
              <div key={qi} className="ak-admin__question">
                <div className="ak-admin__question-header">
                  <strong>Question {qi + 1}</strong>
                  {questions.length > 1 && (
                    <button type="button" className="ak-admin__icon-btn" onClick={() => removeQuestion(qi)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <Input
                  label="Description"
                  value={q.description}
                  onChange={(e) => updateQuestion(qi, 'description', e.target.value)}
                  required
                />
                <Input label="Hint" value={q.hint} onChange={(e) => updateQuestion(qi, 'hint', e.target.value)} />
                <Input
                  label="Full explanation"
                  value={q.full_explaination}
                  onChange={(e) => updateQuestion(qi, 'full_explaination', e.target.value)}
                />

                <div className="ak-admin__answers">
                  {q.answers.map((a, ai) => (
                    <div key={ai} className="ak-admin__answer-row">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={a.correct}
                        onChange={() => updateAnswer(qi, ai, 'correct', true)}
                        title="Mark as correct"
                      />
                      <input
                        className="ak-field__input"
                        placeholder={`Answer ${ai + 1}`}
                        value={a.description}
                        onChange={(e) => updateAnswer(qi, ai, 'description', e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <button type="button" className="ak-admin__link-btn" onClick={() => addAnswer(qi)}>
                    + Add answer
                  </button>
                </div>
              </div>
            ))}

            <Button type="button" variant="ghost" icon={<PlusCircle size={16} />} onClick={addQuestion}>
              Add question
            </Button>
            <Button type="submit" isLoading={isSaving} icon={<Save size={18} />}>
              Save page
            </Button>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 16 }}>Find / delete a page</h3>
          <form onSubmit={handleLookup} className="ak-admin__form">
            <Input label="Year" value={lookupYear} onChange={(e) => setLookupYear(e.target.value)} />
            <Input label="Subject ID" value={lookupSubjectId} onChange={(e) => setLookupSubjectId(e.target.value)} />
            <Button type="submit" variant="secondary" icon={<Search size={16} />} isLoading={isSearching}>
              Look up page
            </Button>
          </form>

          {foundPage && (
            <div className="ak-admin__found">
              <pre className="ak-admin__json">{JSON.stringify(foundPage, null, 2)}</pre>
              <Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDelete}>
                Delete this page
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
