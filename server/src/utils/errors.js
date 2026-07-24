/**
 * Base class for all "expected" application errors.
 * Each subclass carries an HTTP status code so the error-handling
 * middleware can map errors -> responses without a giant if/else chain.
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes "expected" errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidUrlError extends AppError {
  constructor(message = 'The provided URL is not valid.') {
    super(message, 400);
  }
}

export class NonHtmlError extends AppError {
  constructor(message = 'The target URL did not return an HTML page.') {
    super(message, 422);
  }
}

export class FetchTimeoutError extends AppError {
  constructor(message = 'The target site took too long to respond.') {
    super(message, 408);
  }
}

export class UpstreamUnreachableError extends AppError {
  constructor(message = 'The target site could not be reached.') {
    super(message, 502);
  }
}