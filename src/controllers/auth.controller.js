class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async exchangeCode(req, res, next) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          error: {
            statusCode: 400,
            message: 'Authorization code is required in request body',
          },
        });
      }

      const tokenData = await this.authService.exchangeCodeForToken(code);

      res.json({
        success: true,
        data: {
          access_token: tokenData.access_token,
          expires_in: tokenData.expires_in,
          expires_at: tokenData.expires_at,
        },
        message: 'Successfully exchanged OAuth code for access token',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
