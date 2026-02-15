# n8n-support - LinkedIn Post Creation API

Express.js server that integrates with LinkedIn's official API to create posts with title, description, and images.

## Features

- Create LinkedIn posts via REST API
- OAuth2 token management
- Input validation and error handling
- Centralized error handling middleware
- Health check endpoint
- Environment configuration with `.env`
- Docker containerization and automated CI/CD pipeline

## Project Structure

```
src/
├── middleware/
│   └── errorHandler.js          # Error handling and custom error class
├── clients/
│   └── linkedin.client.js        # LinkedIn API client
├── services/
│   └── linkedin.service.js       # Business logic and validation
├── controllers/
│   └── linkedin.controller.js    # HTTP request handlers
├── routes/
│   ├── health.route.js           # Health check endpoint
│   └── linkedin.route.js         # LinkedIn routes
└── index.js                      # Server entry point
```

## Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env` file in the project root with the following variables:

```
PORT=3000
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_ACCESS_TOKEN=your_access_token_here
NODE_ENV=development
```

2. Update the values with your LinkedIn API credentials

## Running the Server

### Development (with auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on the port specified in the `.env` file (default: 3000).

### Docker

Build and run the application in a Docker container:

```bash
docker build -t n8n-support .
docker run -p 3000:3000 --env-file .env n8n-support
```

The project includes automated Docker builds and pushes to DockerHub via GitHub Actions on every push to the main branch.

## API Endpoints

### Health Check

- **URL:** `GET /health`
- **Response:**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Create LinkedIn Post

- **URL:** `POST /api/linkedin/posts`
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "title": "Your post title",
  "description": "Your post description",
  "imageUrl": "https://example.com/image.jpg",
  "visibility": "PUBLIC"
}
```

- **Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "id": "urn:li:ugcPost:1234567890",
    ...
  },
  "message": "LinkedIn post created successfully"
}
```

- **Response (Error):**

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Error description"
  }
}
```

## Request Validation

- **title** (required): String, max 200 characters
- **description** (required): String, max 3000 characters
- **imageUrl** (optional): Valid URL string
- **visibility** (optional): String, default "PUBLIC"

## Error Handling

The API uses centralized error handling with HTTP status codes:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (token issues)
- `500`: Internal Server Error

## Dependencies

- **express**: Web framework
- **axios**: HTTP client for LinkedIn API requests
- **dotenv**: Environment variable management
- **nodemon** (dev): Auto-restart server on file changes

## License

ISC
