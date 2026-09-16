let app;
let initError = null;

try {
  app = require('../dist/app').default || require('../dist/app');
} catch (err) {
  initError = err;
  console.error('CRITICAL initialization error in api/index.js:', err);
}

module.exports = (req, res) => {
  if (initError || !app) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'error',
      message: 'Backend serverless function failed during startup',
      error: initError?.message || 'Unknown error',
      stack: initError?.stack || null
    }, null, 2));
  }

  try {
    return app(req, res);
  } catch (runtimeErr) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'error',
      message: 'Unhandled error while processing request',
      error: runtimeErr?.message || String(runtimeErr)
    }, null, 2));
  }
};

module.exports.app = app;
module.exports.default = module.exports;
