export default function ReportCard({ report }) {
  if (!report) return null;

  const items = [
    { label: 'HTTP Status', value: report.httpStatus },
    { label: 'Response Time', value: `${report.responseTimeMs} ms` },
    { label: 'Title', value: report.title || 'Not available' },
    { label: 'Meta Description', value: report.metaDescription || 'Not available' },
    { label: 'H1 Count', value: report.h1Count },
    { label: 'Images Missing Alt', value: report.missingAltCount },
    { label: 'Word Count', value: report.wordCount },
  ];

  return (
    <div className="report-grid">
      {items.map((item) => (
        <div className="report-card" key={item.label}>
          <h3 className="report-card__label">{item.label}</h3>
          <p className="report-card__value">{item.value}</p>
        </div>
      ))}
    </div>
  );
}