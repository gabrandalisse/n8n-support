const { ApiError } = require("../middleware/errorHandler");

class ValidationService {
  validatePostPayload(payload) {
    if (!payload) {
      throw new ApiError(400, "Payload is required");
    }

    const { title, description, imageUrl } = payload;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw new ApiError(
        400,
        "Title is required and must be a non-empty string",
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      throw new ApiError(
        400,
        "Description is required and must be a non-empty string",
      );
    }

    if (title.length > 200) {
      throw new ApiError(400, "Title must not exceed 200 characters");
    }

    if (description.length > 3000) {
      throw new ApiError(400, "Description must not exceed 3000 characters");
    }

    if (imageUrl) {
      if (typeof imageUrl !== "string" || !this.isValidUrl(imageUrl)) {
        throw new ApiError(400, "ImageUrl must be a valid URL");
      }
    }
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = ValidationService;