const express = require('express');

function createHealthRoutes() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });

  return router;
}

module.exports = createHealthRoutes;
