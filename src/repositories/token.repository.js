const logger = require("../config/logger");

class TokenRepository {
  constructor(db) {
    this.db = db;
  }

  async getToken() {
    try {
      const data = await this.db.getData("/access_token");
      return data;
    } catch (error) {
      if (error.message.includes("Can't find dataPath")) {
        logger.debug("No token found in database");
        return null;
      }
      logger.error("Error retrieving access token:", error);
      throw error;
    }
  }

  async saveToken(token) {
    try {
      await this.db.push("/access_token", token);
      logger.info("Access token saved to database");
    } catch (error) {
      logger.error("Error saving access token:", error);
      throw error;
    }
  }

  async isTokenExpired(tokenData) {
    try {
      if (!tokenData || !tokenData.expires_at) {
        return true;
      }

      const isExpired = Date.now() >= tokenData.expires_at;
      
      if (isExpired) {
        logger.warn("Token has expired");
      }

      return isExpired;
    } catch (error) {
      logger.error("Error checking token expiration:", error);
      throw error;
    }
  }

  async deleteToken() {
    try {
      await this.db.delete("/access_token");
      logger.info("Access token deleted from database");
    } catch (error) {
      logger.error("Error deleting access token:", error);
      throw error;
    }
  }
}

module.exports = TokenRepository;
