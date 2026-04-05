/**
 * Admin action logger middleware.
 * Logs every admin API call with the admin's email, method, path, and timestamp.
 */
export const adminLogger = (req, res, next) => {
    const email = req.user?.email || 'unknown';
    const timestamp = new Date().toISOString();
    console.log(`[ADMIN ACTION] ${email} | ${req.method} ${req.path} | ${timestamp}`);
    next();
};
