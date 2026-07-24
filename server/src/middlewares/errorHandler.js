export function errorHandler(err, req, res, next) { 
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : 'Internal server error.';

  if (!err.isOperational) {
    // Log unexpected errors loudly for debugging; never leak internals to the client.
    console.error('[UNEXPECTED ERROR]', err);
  }

  res.status(statusCode).json({ error: { message } });
}