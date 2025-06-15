# Acquired.com MCP Server

A Model Context Protocol (MCP) server implementation for integrating with the Acquired.com payment gateway API. This server provides a standardized interface for creating payment links, processing payments, and managing transactions through Claude Desktop.

## Features

- 🔐 Secure authentication with Acquired.com API
- 💳 Payment link creation and management
- 💰 Payment processing capabilities
- 🔄 Server-Sent Events (SSE) support
- 📝 TypeScript implementation with type safety
- 🧪 Comprehensive test suite
- 🔄 Automatic token refresh and retry logic

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Acquired.com API credentials (App ID and App Key)

## Quick Start

1. **Clone the repository:**
   ```sh
   git clone https://github.com/RichardAcquired/acquired-mcp.git
   cd acquired-mcp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and update the values:
   ```sh
   cp .env.example .env
   ```
   Then edit `.env` with your Acquired.com credentials:
   ```
   ACQUIRED_API_BASE_URL=https://test-api.acquired.com/v1
   ACQUIRED_APP_ID=your_app_id
   ACQUIRED_APP_KEY=your_app_key
   PORT=3001
   NODE_ENV=development
   ```

4. **Build the project:**
   ```sh
   npm run build
   ```

5. **Run the server:**
   ```sh
   npm start
   ```

## API Examples

### Creating a Payment Link

```typescript
const paymentLink = await createPaymentLink({
  transaction: {
    order_id: 'order-123',
    amount: 50.00,
    currency: 'GBP',
    capture: true,
    custom_data: 'test-payment'
  },
  payment: {
    reference: 'payment-ref-123'
  },
  tds: {
    is_active: false,
    challenge_preference: 'no_preference',
    contact_url: 'https://example.com/contact'
  },
  is_recurring: false,
  count_retry: 1,
  expires_in: 3600,
  redirect_url: 'https://example.com/redirect',
  webhook_url: 'https://example.com/webhook',
  payment_methods: ['card'],
  submit_type: 'pay'
});
```

## Project Structure

```
acquired-mcp/
├── src/
│   └── typescript/
│       ├── api/                    # API implementation
│       │   ├── acquired-com/       # Acquired.com specific code
│       │   │   ├── payment-link.ts # Payment link functionality
│       │   │   └── utils/          # API utilities
│       │   └── payment-routes.ts   # Payment route handlers
│       ├── server/                 # MCP server implementation
│       ├── types/                  # TypeScript type definitions
│       └── tests/                  # Test files
├── dist/                          # Compiled JavaScript
├── .env.example                   # Example environment variables
└── package.json                   # Project configuration
```

## Development

### Running Tests

```sh
# Run authentication test
npm run test:auth

# Run payment link test
npm run test:payment-link
```

### Building

```sh
# Development build
npm run build

# Production build
npm run build:prod
```

## Using with Claude Desktop

1. Start the server:
   ```sh
   npm start
   ```

2. In Claude Desktop:
   - Navigate to MCP server configuration
   - Set server URL to `http://localhost:3001`
   - Available tools will be automatically discovered

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- API credentials are stored in environment variables
- All API requests use HTTPS
- Token-based authentication with automatic refresh
- Input validation and sanitization

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the [Acquired.com documentation](https://docs.acquired.com)
2. Open an [issue](https://github.com/RichardAcquired/acquired-mcp/issues) for questions or bug reports
3. Review existing issues and discussions in the [GitHub repository](https://github.com/RichardAcquired/acquired-mcp)
