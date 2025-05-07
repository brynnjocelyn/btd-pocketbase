# API Documentation

This project includes comprehensive API documentation for developers. Below are the ways to access the documentation for various features.

## Available Documentation Methods

### 1. Web Interface (Recommended)

The documentation is available as HTML pages served by the PocketBase server:

- Main Documentation Index: [http://your-server-url/api_docs.html](http://your-server-url/api_docs.html)
- Image Messaging API: [http://your-server-url/image_message_api.html](http://your-server-url/image_message_api.html)

### 2. Markdown Files

For developers who prefer markdown files:

- Image Messaging API: [http://your-server-url/image_message_api.md](http://your-server-url/image_message_api.md)

### 3. Admin Panel Integration

For admin users, documentation is available directly through the admin panel:

1. Log in to the PocketBase Admin UI
2. Navigate to [http://your-server-url/api/custom/docs](http://your-server-url/api/custom/docs)

## Local Development

When developing locally, replace `your-server-url` with your local server address, typically:
- `http://localhost:8090`

## Adding New Documentation

To add new API documentation:

1. Create a markdown file in the `pb_public` directory
2. Generate an HTML version for better viewing
3. Update the documentation index at `api_docs.html`

## Documentation Standards

All API documentation should include:

- Request/response formats
- Authentication requirements
- Error codes and responses
- Example usage
- Rate limiting information (if applicable)

---

For any questions about the API documentation, please contact the development team.