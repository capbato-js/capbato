# CORS Configuration Guide

## Overview

The API now supports multiple CORS origins for improved development and deployment flexibility. You can configure one or multiple allowed origins using the `CORS_ORIGIN` environment variable.

## Configuration Options

### 1. Single Origin
```bash
CORS_ORIGIN=http://localhost:3000
```

### 2. Multiple Origins (Comma-separated)
```bash
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:4200
```

### 3. Multiple Origins (JSON Array)
```bash
CORS_ORIGIN=["http://localhost:3000","https://myapp.com","https://staging.myapp.com"]
```

## Default Configuration

When `CORS_ORIGIN` is not set, the API defaults to allowing these development origins:
- `http://localhost:3000` (React/Next.js default)
- `http://localhost:4200` (Angular default)
- `http://localhost:5173` (Vite default)
- `http://127.0.0.1:3000` (localhost alternative)
- `http://127.0.0.1:4200` (localhost alternative)
- `http://127.0.0.1:5173` (localhost alternative)

## Environment-Specific Configuration

### Development
Development environment automatically allows multiple localhost ports for easier development.

### Staging
```bash
STAGING_CORS_ORIGIN=https://staging.myapp.com,https://preview.myapp.com
```

### Production
```bash
PRODUCTION_CORS_ORIGIN=https://myapp.com,https://www.myapp.com
```

## Example `.env` Configuration

```dotenv
# Single origin for production
CORS_ORIGIN=https://myapp.com

# Multiple origins for development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:4200

# With additional CORS settings
CORS_CREDENTIALS=true
CORS_METHODS=["GET","POST","PUT","DELETE","OPTIONS"]
CORS_ALLOWED_HEADERS=["Content-Type","Authorization"]
```

## Testing CORS Configuration

You can test your CORS configuration by making requests from different origins:

```javascript
// From browser console on http://localhost:3000
fetch('http://localhost:4000/api/health')
  .then(response => response.json())
  .then(data => console.log('CORS working:', data))
  .catch(error => console.error('CORS error:', error));
```

## Security Notes

- Always restrict CORS origins in production environments
- Never use wildcards (`*`) for production CORS origins when credentials are enabled
- Regularly review and update allowed origins
- Consider using HTTPS origins for production environments
