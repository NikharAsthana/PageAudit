import { auditUrl } from '../services/auditService.js';

export async function postAudit(req, res, next) {
  try {
    const { url } = req.body;
    if (typeof url !== 'string' || url.trim() === '') {
      return res.status(400).json({
        error: { message: 'Request body must include a non-empty "url" string.' },
      });
    }
    const report = await auditUrl(url.trim());
    res.status(200).json({ data: report });
  } catch (err) {
    next(err); // hand off to the centralized error-handling middleware
  }
}
