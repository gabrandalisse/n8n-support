const axios = require("axios");
const { ApiError } = require("../middleware/errorHandler");
const logger = require("../config/logger");

const LINKEDIN_API_BASE_URL = "https://api.linkedin.com/v2";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

class LinkedInClient {
  constructor(tokenRepository) {
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    this.tokenRepository = tokenRepository;
  }

  async exchangeCodeForToken(code) {
    try {
      if (!process.env.LINKEDIN_CALLBACK_URL) {
        throw new ApiError(500, "LINKEDIN_CALLBACK_URL is not configured");
      }

      logger.info("Exchanging OAuth code for access token");

      const response = await axios.post(
        LINKEDIN_TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token, expires_in } = response.data;

      if (!access_token) {
        throw new ApiError(
          500,
          "Failed to retrieve access token from LinkedIn",
        );
      }

      const tokenData = {
        access_token,
        expires_in,
        expires_at: Date.now() + expires_in * 1000,
      };

      logger.info("Successfully obtained  access token from LinkedIn");
      return tokenData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.error_description ||
        error.message ||
        "Failed to exchange OAuth code for access token";

      logger.error(`Failed to exchange code for token: ${message}`);
      throw new ApiError(statusCode, message);
    }
  }

  async getAccessToken() {
    try {
      const tokenData = await this.tokenRepository.getToken();

      logger.debug("Retrieved token data from repository:" + JSON.stringify(tokenData));

      if (!tokenData) {
        throw new ApiError(
          401,
          "No access token found. Please exchange an OAuth code first.",
        );
      }

      if (await this.tokenRepository.isTokenExpired(tokenData)) {
        throw new ApiError(
          401,
          "Access token has expired. Please exchange a new OAuth code.",
        );
      }

      return tokenData.access_token;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Failed to get access token: ${error.message}`);
      throw new ApiError(
        500,
        `Failed to retrieve access token: ${error.message}`,
      );
    }
  }

  async getUserProfile(accessToken) {
    try {
      logger.info(
        "Fetching user profile from LinkedIn /me endpoint" +
          JSON.stringify({ accessToken }),
      );

      const response = await axios.get(`${LINKEDIN_API_BASE_URL}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      logger.info(
        "LinkedIn /me response data: " + JSON.stringify(response.data),
      );

      const memberId = response.data.sub;

      if (!memberId) {
        logger.error("No id found in /me response");
        throw new ApiError(500, "Failed to retrieve member ID from LinkedIn");
      }

      logger.info(`Retrieved member ID from /me endpoint: ${memberId}`);
      return memberId;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;

      logger.error(
        `Failed to fetch user profile: Status ${statusCode}, Message: ${errorMessage}`,
      );

      throw new ApiError(
        statusCode,
        `Failed to retrieve member ID: ${errorMessage}`,
      );
    }
  }

  async createPost(postData) {
    try {
      const token = await this.getAccessToken();

      logger.info("Fetching member ID from LinkedIn profile");
      const memberId = await this.getUserProfile(token);

      const isImagePost = Boolean(postData.imageUrl);

      const payload = {
        author: `urn:li:person:${memberId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: `${postData.title}\n\n${postData.description}`,
            },
            shareMediaCategory: isImagePost ? "IMAGE" : "NONE",
            ...(isImagePost && {
              media: [
                {
                  status: "READY",
                  media: postData.imageUrl,
                },
              ],
            }),
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility":
            postData.visibility || "PUBLIC",
        },
      };

      const response = await axios.post(
        `${LINKEDIN_API_BASE_URL}/ugcPosts`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "LinkedIn-Version": "202401",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create LinkedIn post";

      throw new ApiError(statusCode, message);
    }
  }
}

module.exports = LinkedInClient;
