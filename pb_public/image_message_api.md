# Image Messaging API

This document outlines how to use the Image Messaging API to send and retrieve image messages.

## Message Structure

A message with an image has the following structure:

```json
{
  "id": "RECORD_ID",
  "chatId": "CHAT_ID",
  "sender": "USER_ID",
  "content": "Optional caption for the image",
  "messageType": "image",
  "image": "filename.jpg",
  "thumbnailUrl": "/api/files/messages/RECORD_ID/filename.jpg?thumb=100x100",
  "created": "2025-05-07 12:34:56.789Z",
  "updated": "2025-05-07 12:34:56.789Z"
}
```

## Sending an Image Message

To send an image message, make a POST request to the messages endpoint with a multipart form:

```
POST /api/collections/messages/records
```

### Request Body (FormData)

| Field       | Type   | Description                      | Required |
|-------------|--------|----------------------------------|----------|
| chatId      | string | ID of the chat                   | Yes      |
| sender      | string | ID of the sender                 | Yes      |
| content     | string | Caption or description (optional)| No       |
| image       | file   | Image file (max 5MB)             | Yes      |

### Example Using Fetch

```javascript
const formData = new FormData();
formData.append("chatId", "CHAT_ID");
formData.append("sender", "USER_ID");
formData.append("content", "Check out this image!");
formData.append("image", imageFile); // File object

const response = await fetch("/api/collections/messages/records", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_TOKEN"
  },
  body: formData
});

const data = await response.json();
```

## Retrieving Images

### Get Full Image

```
GET /api/files/messages/{recordId}/{filename}
```

### Get Thumbnail

```
GET /api/files/messages/{recordId}/{filename}?thumb=100x100
```

## Listing Messages with Images

When listing messages, you can expand the sender field to get user information:

```
GET /api/collections/messages/records?filter=(chatId='CHAT_ID')&sort=-created&expand=sender
```

## Image Validation Rules

- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP

## Error Responses

| Status Code | Description                            |
|-------------|----------------------------------------|
| 400         | Invalid file format or size too large  |
| 401         | Unauthorized (missing or invalid token)|
| 404         | Chat or message not found              |
| 500         | Server error                           |

## Notes

- Images are automatically saved with their original filenames
- A 100x100 thumbnail is generated automatically
- The thumbnailUrl is a relative path from the server's root (does not include domain)
- When a message with an image is created, the chat's preview is updated with "📷 Image" and the caption if provided
- Client applications should prepend their base URL to the thumbnailUrl when making requests