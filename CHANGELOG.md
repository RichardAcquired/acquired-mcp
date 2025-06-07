# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-07

### Added
- Initial release of the Acquired.com Payment Link MCP Server
- Support for creating payment links with customizable amounts and metadata
- Support for sending payment links via email
- MCP compatibility for AI assistants like Claude
- Command-line interface for testing and development
- Comprehensive documentation and examples
- ESLint and Prettier configurations for code quality
- Test suite for payment link creation and sending
- Environment variable configuration for API credentials
- Basic Docker configuration for containerization

### Features
- `create_payment_link` tool:
  - Create payment links with customizable amounts
  - Support for optional metadata (currency, order_id, customer_id)
  - Automatic conversion of amounts from pounds to pence
  - Validation of required fields and data types

- `send_payment_link` tool:
  - Send payment links via email
  - Customisable message templates
  - Validation of required fields and contact information

### Technical Details
- Built with Node.js (v18+)
- Uses Model Context Protocol (MCP) for AI assistant integration
- Implements Acquired.com API for payment processing
- Includes comprehensive error handling and validation
- Supports environment-based configuration
- Basic Docker support for containerization 