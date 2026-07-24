import { useState } from 'react';

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export default function AuditForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const trimmed = url.trim();
  const isValid = isValidUrl(trimmed);
  const showError = touched && trimmed !== '' && !isValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isValid) onSubmit(trimmed);
  };

  return (
    <form className="audit-form" onSubmit={handleSubmit}>
      <label htmlFor="url-input" className="sr-only">
        Website URL
      </label>
      <input
        id="url-input"
        type="url"
        inputMode="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={showError}
        aria-describedby={showError ? 'url-error' : undefined}
        className="audit-form__input"
      />
      <button
        type="submit"
        disabled={loading || trimmed === '' || !isValid}
        className="audit-form__button"
      >
        {loading ? 'Auditing…' : 'Audit'}
      </button>
      {showError && (
        <p id="url-error" role="alert" className="audit-form__error">
          Please enter a valid URL, including http:// or https://
        </p>
      )}
    </form>
  );
}