const { ApiError } = require("../middleware/errorHandler");
const logger = require("../config/logger");

class LinkedInService {
  constructor(validationService, linkedInClient, tokenRepository) {
    this.validationService = validationService;
    this.linkedInClient = linkedInClient;
    this.tokenRepository = tokenRepository;
  }

  async createPost(postPayload) {
    try {
      logger.info(
        `Attempting to create LinkedIn post with payload: ${JSON.stringify(postPayload)}`,
      );
      this.validationService.validatePostPayload(postPayload);

      const response = await this.linkedInClient.createPost(postPayload);
      logger.info("Successfully created LinkedIn post");

      return response;
    } catch (error) {
      logger.error(`Error creating LinkedIn post: ${error.message}`);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        `Failed to create LinkedIn post: ${error.message}`,
      );
    }
  }

  async exchangeCodeForToken(code) {
    try {
      if (!code) {
        throw new ApiError(400, "Authorization code is required");
      }

      logger.info("Processing OAuth code exchange");

      const tokenData = await this.linkedInClient.exchangeCodeForToken(code);

      await this.tokenRepository.saveToken(tokenData);
      logger.info(
        "Successfully exchanged code for access token and saved to repository",
      );

      return {
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        expires_at: tokenData.expires_at,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`OAuth code exchange error: ${error.message}`);
      throw new ApiError(
        500,
        `Failed to exchange OAuth code: ${error.message}`,
      );
    }
  }
}

module.exports = LinkedInService;
