class ContentAutomationController {
  constructor(linkedInService) {
    this.linkedInService = linkedInService;
  }

  async createPost(req, res, next) {
    try {
      const { title, description, imageUrl, visibility } = req.body;

      const response = await this.linkedInService.createPost({
        title,
        description,
        imageUrl,
        visibility,
      });

      res.status(201).json({
        success: true,
        data: response,
        message: 'LinkedIn post created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ContentAutomationController;
