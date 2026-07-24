const DEFAULT_TEXT = 'Built for Digital Heroes Training Task';
const DEFAULT_LINK = 'https://digitalheroesco.com';

export default function Footer() {
  const text = import.meta.env.VITE_FOOTER_TEXT || DEFAULT_TEXT;
  const link = import.meta.env.VITE_FOOTER_LINK || DEFAULT_LINK;

  return (
    <footer className="app-footer">
      <a href={link} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    </footer>
  );
}