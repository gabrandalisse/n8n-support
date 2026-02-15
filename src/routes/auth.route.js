const express = require('express');

function createAuthRoutes(authController) {
  const router = express.Router();

  router.post('/exchange-code', (req, res, next) => {
    authController.exchangeCode(req, res, next);
  });

  return router;
}

module.exports = createAuthRoutes;
