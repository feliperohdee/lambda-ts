# 🚀 Lambda TypeScript Template

A modern template for AWS Lambda functions using TypeScript, built with esbuild for fast and efficient bundling, with local development server, testing, and deployment scripts.

## ✨ Features

- **TypeScript-First**: Built with TypeScript for rock-solid type safety and modern JavaScript features
- **Fast Builds**: Lightning-fast compilation with esbuild
- **Development Server**: Local development environment with hot-reload and request logging
- **Testing**: Configured with Vitest for fast, reliable testing
- **Code Quality**: ESLint and Prettier configurations for consistent code style
- **AWS Lambda Ready**: Pre-configured for AWS Lambda with deployment scripts
- **Path Aliases**: Configured with `@/*` path aliases for cleaner imports
- **Environment Support**: Staging and Production environment configurations

## 🛠 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- AWS CLI configured with appropriate credentials

### Installation

```bash
yarn install
```

### Development

Start the local development server:

```bash
yarn dev
```

This will start a local server at `http://localhost:3000` with:
- 🔄 Hot reload support
- 📝 Pretty request logging
- 🚦 Request timing
- 🎨 Color-coded HTTP methods

### Testing

Run tests:

```bash
yarn test
```

Generate coverage report:

```bash
yarn test:coverage
```

### Building

Build the project:

```bash
yarn build
```

### Deployment

Deploy to AWS Lambda:

```bash
# Deploy to production
yarn deploy

# Deploy to staging
yarn deploy --staging

# Update Lambda configuration only
yarn deploy --config
```

## 🏗 Project Structure

```
├── scripts/              # Build and deployment scripts
├── src/                  # Source code
│   ├── api.ts           # API implementation
│   ├── index.ts         # Lambda handler
│   └── *.spec.ts        # Test files
├── dist/                # Compiled output
└── coverage/            # Test coverage reports
```

## 📝 Configuration Files

- `.prettierrc` - Prettier configuration
- `eslint.config.js` - ESLint configuration
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest test runner configuration

## 🔧 Environment Configuration

The project supports multiple environments through separate Lambda configuration files:

- `lambda-config.json` - Production configuration
- `lambda-config-staging.json` - Staging configuration

## 📚 Available Scripts

- `yarn dev` - Start development server
- `yarn test` - Run tests
- `yarn test:coverage` - Generate test coverage report
- `yarn build` - Build the project
- `yarn deploy` - Deploy to AWS Lambda

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ using TypeScript and AWS Lambda