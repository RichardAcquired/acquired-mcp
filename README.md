# Acquired.com Payment Link MCP Server

A TypeScript-based Model Context Provider (MCP) server for creating and sending payment links using the Acquired.com API.

## Features

- Create payment links with customizable amounts
- Send payment links via email or SMS
- TypeScript support with proper type definitions
- Input validation using Zod schemas
- UK phone number formatting support
- Environment variable configuration
- Source maps for debugging

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
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

3. Create a `.env` file with your API credentials:
```env
ACQUIRED_COM_APP_ID=your_app_id
ACQUIRED_COM_APP_KEY=your_app_key
```

## Usage

### Building the Project

```bash
npm run build
```

### Running the Server

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## API Usage

### Creating a Payment Link

```typescript
import { apiTool } from './dist/tools/acquired-com-api/acquired-com/payment-link.js';

const result = await apiTool.function({
  transaction: {
    amount: 45.00,
    currency: 'GBP'
  }
});
```

### Sending a Payment Link

```typescript
import { apiTool } from './dist/tools/acquired-com-api/acquired-com/send-payment-link.js';

// Via Email
const emailResult = await apiTool.function({
  link_id: 'your_link_id',
  type: 'email',
  email: 'recipient@example.com',
  message: 'Your payment link'
});

// Via SMS
const smsResult = await apiTool.function({
  link_id: 'your_link_id',
  type: 'sms',
  phone: {
    number: '07763270200'  // UK number format
  },
  message: 'Your payment link'
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Acquired.com for providing the API
- The MCP community for their support and feedback
