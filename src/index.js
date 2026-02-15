require("dotenv").config();

const express = require("express");
const logger = require("./config/logger");
const helmetConfig = require("./config/helmet");
const { errorHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const LinkedInClient = require("./clients/linkedin.client");
const LinkedInService = require("./services/linkedin.service");
const ContentAutomationService = require("./services/content-automation.service");
const ValidationService = require("./services/validation.service");
const ContentAutomationController = require("./controllers/content-automation.controller");
const createContentAutomationRoutes = require("./routes/content-automation.route");
const createHealthRoutes = require("./routes/health.route");
const db = require("./config/node-json-db");
const TokenRepository = require("./repositories/token.repository");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetConfig);
app.use(requestLogger);

const tokenRepository = new TokenRepository(db);
const linkedInClient = new LinkedInClient(tokenRepository);
const validationService = new ValidationService();
const linkedInService = new LinkedInService(
  validationService,
  linkedInClient,
  tokenRepository,
);

const contentAutomationService = new ContentAutomationService(linkedInService);
const contentAutomationController = new ContentAutomationController(
  contentAutomationService,
);

app.use("/health", createHealthRoutes());
app.use(
  "/api/content-automation",
  createContentAutomationRoutes(contentAutomationController),
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
