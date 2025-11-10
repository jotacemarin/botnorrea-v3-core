# Botnorrea v3 Core API

API server built with Hono for handling Telegram webhooks and public webhook services.

## API Endpoints

### POST /telegram/webhook

Receives Telegram webhook updates. Requires a secret query parameter for authentication.

**Authentication:** Query parameter `secret` must match `TELEGRAM_WEBHOOK_SECRET` environment variable.

**Request:**

```bash
curl -X POST "https://your-api.com/telegram/webhook?secret=your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "text": "Hello, world!",
      "chat": {
        "id": 123456789
      },
      "message_id": 1
    }
  }'
```

**Response (200 OK):**

```json
{
  "message": "Message received"
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Bad Request"
}
```

**Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

### POST /telegram/debug

Debug endpoint that receives Telegram updates and sends back a formatted debug message to the chat.

**Request:**

```bash
curl -X POST "https://your-api.com/telegram/debug" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "text": "debug this",
      "chat": {
        "id": 123456789
      },
      "message_id": 1
    }
  }'
```

**Response (200 OK):**

```json
{
  "success": true
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Invalid request"
}
```

The endpoint will send a formatted debug message back to the Telegram chat containing the received update or the replied-to message if present.

### POST /public/webhook

Public webhook endpoint for sending messages to various services. Currently supports Telegram.

**Authentication:** Basic Auth required. Username must be a valid consumer ID, password must match the consumer's API key.

**Request:**

```bash
curl -X POST "https://your-api.com/public/webhook" \
  -u "consumer-id:api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "service": "telegram",
    "chat_id": 123456789,
    "text": "Hello from the API!"
  }'
```

**Response (200 OK):**

```json
{
  "message": "Message sent successfully"
}
```

**Response (400 Bad Request):**

```json
{
  "error": "service is missing"
}
```

```json
{
  "error": "chat_id is missing"
}
```

```json
{
  "error": "text, photo or video params are missing"
}
```

```json
{
  "error": "service not found"
}
```

**Response (401 Unauthorized):**
Basic Auth authentication failed.

**Supported Services:**

- `telegram` - Send messages to Telegram chats

**Unsupported Services:**

- `whatsapp` - Returns error: "whatsapp service is not supported"
- `discord` - Returns error: "discord service is not supported"

## Request/Response Format

All endpoints accept and return JSON. The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized

## Environment Variables

- `TELEGRAM_WEBHOOK_SECRET` - Secret key for authenticating Telegram webhook requests
