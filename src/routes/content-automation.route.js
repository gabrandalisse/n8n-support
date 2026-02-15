const express = require("express");

function createContentAutomationRoutes(contentAutomationController) {
  const router = express.Router();

  router.post("/posts", (req, res, next) => {
    contentAutomationController.createPost(req, res, next);
  });

  router.post("/exchange-code", (req, res, next) => {
    contentAutomationController.exchangeCode(req, res, next);
  });

  return router;
}

module.exports = createContentAutomationRoutes;
