const express = require("express");

function createContentAutomationRoutes(contentAutomationController) {
  const router = express.Router();

  router.post("/posts", (req, res, next) => {
    contentAutomationController.createPost(req, res, next);
  });

  router.post("/exchange-code", (req, res, next) => {
    contentAutomationController.exchangeCodeForToken(req, res, next);
  });

  router.post("/set-access-token", (req, res, next) => {
    contentAutomationController.setAccessToken(req, res, next);
  });

  router.post("/test", (req, res, next) => {
    contentAutomationController.test(req, res, next);
  });

  return router;
}

module.exports = createContentAutomationRoutes;
