import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { postAudit } from '../controllers/auditController.js';

const router = Router();

const auditLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many audit requests. Please slow down.' } },
});

// POST, not GET, because this endpoint triggers a side effect
// (an outbound network request to a third-party site) and accepts
// a body payload rather than encoding everything in a URL query string.
// GET requests should be safe/idempotent and cacheable by intermediaries;
// this isn't, so POST is the correct HTTP semantic.
router.post('/audit', auditLimiter, postAudit);

export default router;