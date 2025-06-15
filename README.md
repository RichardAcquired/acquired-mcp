# Acquired.com MCP Server

This project implements a Model Context Protocol (MCP) server for integrating with the Acquired.com API. It provides tools for creating payment links and processing payments.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Acquired.com API credentials (App ID and App Key)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd acquired-mcp-server
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   ACQUIRED_API_BASE_URL=https://test-api.acquired.com/v1
   ACQUIRED_APP_ID=your_app_id
   ACQUIRED_APP_KEY=your_app_key
   PORT=3001
   ```

## Building the Project

Run the following command to build the TypeScript project:
```sh
npm run build
```

## Running the Server

### Standard Mode
Run the server in standard mode:
```sh
node dist/typescript/server/index.js
```

### SSE Mode
Run the server in Server-Sent Events (SSE) mode:
```sh
node dist/typescript/server/index.js --sse
```

## Using the MCP Server in Claude Desktop

1. **Start the server** in either standard or SSE mode.
2. **Open Claude Desktop** and navigate to the MCP server configuration.
3. **Configure the server URL** to `http://localhost:3001` (or the port you specified).
4. **Use the provided tools** (e.g., `create_payment_link`) to interact with the Acquired.com API.

## Testing

### Authentication Test
Run the authentication test to verify your API credentials:
```sh
node dist/typescript/api/acquired-com/utils/test-auth.js
```

## Project Structure

- `src/typescript/`: TypeScript source files
  - `api/`: API-related code
  - `server/`: MCP server implementation
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions
- `dist/`: Compiled JavaScript files

## Contributing

1. Fork the repository.
2. Create a new branch for your feature.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## License

This project is licensed under the MIT License.
