const express = require("express");

function createContentAutomationRoutes(contentAutomationController) {
  const router = express.Router();

  router.post("/posts", (req, res, next) => {
    contentAutomationController.createPost(req, res, next);
  });

  return router;
}

module.exports = createContentAutomationRoutes;
