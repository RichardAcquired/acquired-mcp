# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-03-19

### Added
- TypeScript support with proper type definitions
- Input validation using Zod schemas
- Better error handling and type safety
- Improved phone number formatting for UK numbers
- Source maps for better debugging

### Changed
- Migrated from JavaScript to TypeScript
- Updated project structure to use src/ directory
- Improved error messages and validation
- Enhanced documentation and type definitions

### Fixed
- Phone number formatting for UK numbers (removing leading 0)
- Amount handling to use base currency unit
- Validation schema for phone numbers

## [1.0.0] - 2024-03-19

### Added
- Initial release
- Payment link creation functionality
- Email and SMS sending capabilities
- Basic error handling
- Environment variable support

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