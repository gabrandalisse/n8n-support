class ContentAutomationController {
  constructor(contentAutomationService) {
    this.contentAutomationService = contentAutomationService;
  }

  async createPost(req, res, next) {
    try {
      const { title, description, imageUrl, visibility } = req.body;

      const response = await this.contentAutomationService.createPost({
        title,
        description,
        imageUrl,
        visibility,
      });

      res.status(201).json({
        success: true,
        data: response,
        message: "post created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async exchangeCodeForToken(req, res, next) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          error: {
            statusCode: 400,
            message: "Authorization code is required in request body",
          },
        });
      }

      const tokenData =
        await this.contentAutomationService.exchangeCodeForToken(code);

      res.json({
        success: true,
        data: {
          access_token: tokenData.access_token,
          expires_in: tokenData.expires_in,
          expires_at: tokenData.expires_at,
        },
        message: "Successfully exchanged OAuth code for access token",
      });
    } catch (error) {
      next(error);
    }
  }

  async setAccessToken(req, res, next) {
    try {
      const {
        tokenData: { access_token, expires_in, expires_at },
      } = req.body;

      if (!access_token || !expires_in || !expires_at) {
        return res.status(400).json({
          success: false,
          error: {
            statusCode: 400,
            message: "Required token data is missing in request body",
          },
        });
      }

      const tokenData = {
        access_token,
        expires_in,
        expires_at,
      };

      await this.contentAutomationService.setAccessToken(tokenData);

      res.json({
        success: true,
        data: tokenData,
        message: "Successfully set access token",
      });
    } catch (error) {
      next(error);
    }
  }

  async test(req, res, next) {
    try {
      res.status(201).json({
        success: true,
        data: req.body,
        message: "post created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContentAutomationController;
