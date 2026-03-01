class ContentAutomationService {
  constructor(linkedinService, tokenRepository) {
    this.linkedinService = linkedinService;
    this.tokenRepository = tokenRepository;
  }

  async createPost(postPayload) {
    try {
      const response = await this.linkedinService.createPost(postPayload);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async exchangeCodeForToken(code) {
    try {
      const tokenData = await this.linkedinService.exchangeCodeForToken(code);
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  async setAccessToken(token) {
    try {
      await this.tokenRepository.saveToken(token);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContentAutomationService;
