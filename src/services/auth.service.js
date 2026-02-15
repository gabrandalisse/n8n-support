const { ApiError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

class AuthService {
  constructor(linkedInClient) {
    this.linkedInClient = linkedInClient;
  }

  async exchangeCodeForToken(code) {
    try {
      if (!code) {
        throw new ApiError(400, 'Authorization code is required');
      }

      logger.info('Processing OAuth code exchange');

      const tokenData = await this.linkedInClient.exchangeCodeForToken(code);

      if (!tokenData.access_token) {
        throw new ApiError(500, 'Failed to retrieve access token from LinkedIn');
      }

      logger.info('Successfully exchanged code for access token');

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
      throw new ApiError(500, `Failed to exchange OAuth code: ${error.message}`);
    }
  }
}

module.exports = AuthService;
