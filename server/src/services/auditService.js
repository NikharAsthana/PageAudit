// src/services/auditService.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  InvalidUrlError,
  NonHtmlError,
  FetchTimeoutError,
  UpstreamUnreachableError,
} from '../utils/errors.js';
import "dotenv/config";

const TIMEOUT_MS = Number(process.env.TIMEOUT_MS) || 8000;

/**
 * Validates that a string is a syntactically valid URL using http/https.
 * Feature 1 (server-side half).
 */
export function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new InvalidUrlError('URL is not syntactically valid.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new InvalidUrlError('Only http:// and https:// URLs are supported.');
  }
  return parsed;
}

/**
 * Parses raw HTML into the report fields we care about.
 * Pure function: given the same HTML, always returns the same shape.
 * Features 4-9.
 */
export function parseHtml(html) {
  const $ = cheerio.load(html || '');

  const title = $('title').first().text().trim() || null;

  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() || null;

  const h1Count = $('h1').length;

  let missingAltCount = 0;
  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt.trim() === '') {
      missingAltCount += 1;
    }
  });

  const bodyText = $('body').text() || '';
  const wordCount = bodyText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title,
    metaDescription,
    h1Count,
    missingAltCount,
    wordCount,
  };
}

/**
 * Orchestrates the full audit: validate -> fetch -> time -> parse.
 * Features 1, 2, 3, plus delegates 4-9 to parseHtml().
 */
export async function auditUrl(rawUrl) {
  const parsedUrl = validateUrl(rawUrl);

  const start = Date.now();
  let response;
  try {
    response = await axios.get(parsedUrl.toString(), {
      timeout: TIMEOUT_MS,
      // Accept any status < 500 so we can report 404s etc. instead of throwing.
      validateStatus: (status) => status < 500,
      headers: { 'User-Agent': `PageAudit/1.0 (+${process.env.VITE_FOOTER_LINK})` },
    });
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      throw new FetchTimeoutError();
    }
    throw new UpstreamUnreachableError(err.message);
  }
  const responseTimeMs = Date.now() - start;

  const contentType = response.headers['content-type'] || '';
  if (!contentType.includes('text/html')) {
    throw new NonHtmlError(
      `Expected text/html but received "${contentType || 'unknown'}".`
    );
  }

  const parsed = parseHtml(response.data);

  return {
    url: parsedUrl.toString(),
    httpStatus: response.status,
    responseTimeMs,
    ...parsed,
  };
}