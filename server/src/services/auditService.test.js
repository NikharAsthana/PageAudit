import { parseHtml, validateUrl } from './auditService.js';
import { InvalidUrlError } from '../utils/errors.js';

describe('parseHtml', () => {
  // Happy path
  test('extracts title, meta description, h1 count, missing alts, and word count', () => {
    const html = `
      <html>
        <head>
          <title>My Test Page</title>
          <meta name="description" content="A page for testing." />
        </head>
        <body>
          <h1>Welcome</h1>
          <h1>Second heading</h1>
          <img src="a.jpg" alt="A photo" />
          <img src="b.jpg" alt="" />
          <img src="c.jpg" />
          <p>Hello world this is some body text for testing purposes</p>
        </body>
      </html>
    `;
    const result = parseHtml(html);
    expect(result.title).toBe('My Test Page');
    expect(result.metaDescription).toBe('A page for testing.');
    expect(result.h1Count).toBe(2);
    expect(result.missingAltCount).toBe(2); // empty alt + no alt
    expect(result.wordCount).toBeGreaterThan(0);
  });

  // Failure case 1: empty HTML string -> graceful defaults, no throw
  test('handles an empty HTML string without throwing', () => {
    const result = parseHtml('');
    expect(result.title).toBeNull();
    expect(result.metaDescription).toBeNull();
    expect(result.h1Count).toBe(0);
    expect(result.missingAltCount).toBe(0);
    expect(result.wordCount).toBe(0);
  });

  // Failure case 2: no <body>, images missing alt entirely
  test('counts missing alt images correctly when there is no body tag', () => {
    const html = `
      <html>
        <head><title>No Body Here</title></head>
        <img src="x.jpg">
        <img src="y.jpg" alt="   ">
      </html>
    `;
    const result = parseHtml(html);
    expect(result.title).toBe('No Body Here');
    expect(result.missingAltCount).toBe(2); // missing + whitespace-only alt
    expect(result.wordCount).toBe(0); // cheerio still creates an implicit body, but it's empty here
  });
});

describe('validateUrl', () => {
  test('accepts a valid https URL', () => {
    expect(() => validateUrl('https://example.com')).not.toThrow();
  });

  test('rejects a syntactically invalid URL', () => {
    expect(() => validateUrl('not a url')).toThrow(InvalidUrlError);
  });

  test('rejects a non-http(s) protocol', () => {
    expect(() => validateUrl('ftp://example.com')).toThrow(InvalidUrlError);
  });
});
