import request from 'supertest';
import { jest } from '@jest/globals';
 
// Register the mock BEFORE importing anything that transitively imports axios.
// In ESM, static `import` statements are hoisted and resolved before any other
// top-level code runs -- so if auditRoutes were statically imported above this
// line, it (and the real axios inside auditService.js) would already be loaded
// by the time jest.unstable_mockModule executes, and the mock would be ignored.
jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn() },
}));
 
// Every one of these must be a dynamic import, in this order, because each
// eventually imports auditService.js -> axios.
const { default: axios } = await import('axios');
const { default: express } = await import('express');
const { default: auditRoutes } = await import('./auditRoutes.js');
const { errorHandler } = await import('../middlewares/errorHandler.js');
 
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', auditRoutes);
  app.use(errorHandler);
  return app;
}
 
describe('POST /api/audit', () => {
  const app = buildApp();
 
  afterEach(() => jest.clearAllMocks());
 
  test('returns 400 for an invalid URL', async () => {
    const res = await request(app).post('/api/audit').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBeDefined();
    // axios should never even be called -- validation fails before any fetch.
    expect(axios.get).not.toHaveBeenCalled();
  });
 
  test('returns 422 for a non-HTML response', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: '{}',
    });
    const res = await request(app)
      .post('/api/audit')
      .send({ url: 'https://example.com/api.json' });
    expect(res.status).toBe(422);
  });
 
  test('returns 408 when the request times out', async () => {
    const timeoutError = new Error('timeout of 8000ms exceeded');
    timeoutError.code = 'ECONNABORTED';
    axios.get.mockRejectedValue(timeoutError);
 
    const res = await request(app)
      .post('/api/audit')
      .send({ url: 'https://slow-example.com' });
    expect(res.status).toBe(408);
  });
 
  test('returns 200 and a full report on success', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      data: '<html><head><title>OK</title></head><body><h1>Hi</h1></body></html>',
    });
 
    const res = await request(app)
      .post('/api/audit')
      .send({ url: 'https://example.com' });
 
    expect(res.status).toBe(200); // should be 200, used 12345 to test github CI
    expect(res.body.data.title).toBe('OK');
    expect(res.body.data.httpStatus).toBe(200);
    expect(res.body.data.h1Count).toBe(1);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
