require("dotenv").config();

const express = require("express");
const logger = require("./config/logger");
const helmetConfig = require("./config/helmet");
const { errorHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const LinkedInClient = require("./clients/linkedin.client");
const LinkedInService = require("./services/linkedin.service");
const AuthService = require("./services/auth.service");
const ContentAutomationController = require("./controllers/content-automation.controller");
const AuthController = require("./controllers/auth.controller");
const createContentAutomationRoutes = require("./routes/content-automation.route");
const createAuthRoutes = require("./routes/auth.route");
const createHealthRoutes = require("./routes/health.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmetConfig);
app.use(requestLogger);

const linkedInClient = new LinkedInClient(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
);

const linkedInService = new LinkedInService(linkedInClient);
const authService = new AuthService(linkedInClient);
const contentAutomationController = new ContentAutomationController(
  linkedInService,
);
const authController = new AuthController(authService);

app.use("/health", createHealthRoutes());
app.use(
  "/api/content-automation",
  createContentAutomationRoutes(contentAutomationController),
);
app.use("/api/auth", createAuthRoutes(authController));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      statusCode: 404,
      message: "Route not found",
    },
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});
