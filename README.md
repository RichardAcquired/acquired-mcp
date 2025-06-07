# Acquired.com Payment Link MCP Server

A Model Context Provider (MCP) server that enables AI assistants to create and send payment links using the Acquired.com API.

## Features

- Create payment links with customizable amounts and metadata
- Send payment links via email or SMS
- MCP-compatible for use with AI assistants like Claude
- Simple command-line interface for testing and development

## Prerequisites

- Node.js v18 or higher
- npm
- Acquired.com API credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RichardAcquired/acquired-mcp.git
cd acquired-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with your Acquired.com API credentials:
```
ACQUIRED_COM_APP_ID=your_app_id
ACQUIRED_COM_APP_KEY=your_app_key
```

## Usage

### Command Line Interface

List available tools:
```bash
npm run list-tools
```

### Creating Payment Links

The `create_payment_link` tool allows you to create payment links with the following parameters:

- `amount` (required): The payment amount in pounds (e.g., 20.00 for £20.00)
- `currency` (optional): The currency code (defaults to GBP)
- `order_id` (optional): A unique identifier for the order
- `customer_id` (optional): The customer's ID
- `submit_type` (optional): The type of submission (defaults to 'payment')

Example:
```javascript
const result = await create_payment_link({
  amount: 20.00,
  order_id: 'order_123',
  customer_id: 'cust_456'
});
```

### Sending Payment Links

The `send_payment_link` tool allows you to send payment links via email or SMS:

- `type` (required): The type of notification ('email' or 'sms')
- `message` (required): The message to send with the payment link
- `email` (required for email): The recipient's email address
- `phone` (required for SMS): The recipient's phone number
- `payment_link_id` (required): The ID of the payment link to send

Example:
```javascript
const result = await send_payment_link({
  type: 'email',
  message: 'Please complete your payment',
  email: 'customer@example.com',
  payment_link_id: 'pl_123'
});
```

## Integration with Claude

1. Get the required values for Claude Desktop configuration:

   a. Get the full path to Node.js:
   ```bash
   which node
   ```
   This will output something like `/usr/local/bin/node` or `/opt/homebrew/bin/node`

   b. Get the full path to mcpServer.js:
   ```bash
   realpath mcpServer.js
   ```
   This will output the absolute path to your mcpServer.js file

2. Add the MCP server configuration to Claude Desktop:
   - Open Settings → Developers → Edit Config
   - Add the following configuration, replacing the paths with your actual values:
   ```json
   {
     "mcpServers": {
       "payment-link": {
         "command": "/path/to/node",
         "args": ["/path/to/mcpServer.js"]
       }
     }
   }
   ```

   For example, if your paths are:
   - Node.js: `/usr/local/bin/node`
   - mcpServer.js: `/Users/username/projects/acquired-mcp/mcpServer.js`

   Your configuration would be:
   ```json
   {
     "mcpServers": {
       "payment-link": {
         "command": "/usr/local/bin/node",
         "args": ["/Users/username/projects/acquired-mcp/mcpServer.js"]
       }
     }
   }
   ```

3. Restart Claude Desktop
4. Start a new conversation and enable the payment-link MCP server

## Development

### Project Structure

```
payment-link-mcp/
├── commands/          # CLI commands
├── lib/              # Shared utilities
├── tools/            # MCP tools
│   └── acquired-com-api/
│       └── acquired-com/
│           ├── payment-link.js
│           └── send-payment-link.js
├── tests/            # Test files
├── .env              # Environment variables
├── .gitignore
├── index.js          # CLI entry point
├── mcpServer.js      # MCP server
└── package.json
```

### Running Tests

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support, please open an issue in the GitHub repository.
