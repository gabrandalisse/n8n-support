class ContentAutomationService {
  constructor(linkedinService) {
    this.linkedinService = linkedinService;
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
}

module.exports = ContentAutomationService;
