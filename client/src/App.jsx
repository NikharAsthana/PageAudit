import './App.css';
import AuditForm from './components/AuditForm.jsx';
import ReportCard from './components/ReportCard.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useAudit } from './hooks/useAudit.js';

export default function App() {
  const { data, loading, error, submitAudit } = useAudit();

  return (
    <div className="app">
      <h1 className="app__title">PageAudit</h1>
      <AuditForm onSubmit={submitAudit} loading={loading} />

      {error && (
        <p role="alert" className="audit-form__error">
          {error}
        </p>
      )}

      <ErrorBoundary>
        <ReportCard report={data} />
      </ErrorBoundary>

      <Footer />
    </div>
  );
}