# API Development Performance Guide

This document explains the different ways to run the API during development and when to use each approach.

## Quick Start

For the **fastest development experience**, use:
```bash
pnpm dev:api
# or 
pnpm start:api:fast
# or
nx serve-fast api
```

## Development Modes

### 1. Fast Development Mode (Recommended) 🚀

**Commands:**
- `pnpm dev:api` 
- `pnpm start:api:fast`
- `nx serve-fast api`

**How it works:**
- Uses `ts-node-dev` with `transpile-only` mode
- Bypasses webpack entirely during development
- Hot reloads on file changes
- Resolves TypeScript paths directly

**Benefits:**
- ⚡ **Fastest startup time** (~3-5 seconds after library builds)
- 🔄 **Instant hot reload** on file changes  
- 💡 **Lower resource usage** during development
- 🎯 **Direct TypeScript execution** without bundling

**When to use:**
- Daily development work
- Quick iterations and testing
- When you need instant feedback on code changes
- Local development environment

**Requirements:**
- Library dependencies must be built first (`nx run-many -t build -p domain,application-shared,application-api,utils-core`)
- Works with the existing dependency injection and decorators

### 2. Traditional Webpack Mode

**Commands:**
- `pnpm start:api`
- `nx serve api`

**How it works:**
- Builds the entire application with webpack
- Runs the built JavaScript file with Node.js
- Requires full build before serving

**Benefits:**
- 🎯 **Production-like bundling** during development
- 📦 **Asset handling** (if needed)
- 🔍 **Full webpack optimization pipeline**
- ✅ **Matches production build process**

**When to use:**
- Testing production-like builds
- Debugging webpack-specific issues
- When you need asset processing
- CI/CD pipeline testing

### 3. Production Build

**Commands:**
- `pnpm build:api`
- `nx build api --configuration=production`

**How it works:**
- Full webpack production build with optimizations
- Tree shaking, minification, and bundling
- Generates optimized bundle for deployment

**When to use:**
- Creating deployment artifacts
- Performance testing with optimized code
- Production deployment

## Performance Comparison

| Mode | Startup Time | Hot Reload | Resource Usage | Use Case |
|------|-------------|------------|----------------|----------|
| **Fast Mode** | ~3-5s | ✅ Instant | Low | Daily development |
| **Webpack Mode** | ~15-20s | ❌ Full rebuild | Medium | Production testing |
| **Production Build** | ~20-30s | ❌ N/A | High | Deployment |

## Configuration Files

- **Fast Mode**: Uses `apps/api/tsconfig.dev.json` with path mapping
- **Webpack Mode**: Uses `apps/api/webpack.config.js` and `tsconfig.app.json`
- **Both modes**: Share the same source code and environment configuration

## Troubleshooting

### Fast Mode Issues

**Problem**: Module resolution errors
```
Cannot find module '@nx-starter/domain'
```

**Solution**: Ensure libraries are built first:
```bash
nx run-many -t build -p domain,application-shared,application-api,utils-core
```

**Problem**: Decorator errors
```
Parameter decorators only work when experimental decorators are enabled
```

**Solution**: The `tsconfig.dev.json` should have `experimentalDecorators: true` (already configured)

### Webpack Mode Issues

**Problem**: Slow startup or builds
**Solution**: The webpack config now uses SWC in development mode for faster compilation

**Problem**: File changes not reflected
**Solution**: Ensure you're using the development configuration: `nx serve api --configuration=development`

## Switching Between Modes

You can switch between modes at any time:

```bash
# Stop current server (Ctrl+C)
# Then start with different mode:

# Switch to fast mode
pnpm dev:api

# Switch to webpack mode  
pnpm start:api

# Switch to production build
pnpm build:api && node dist/apps/api/main.js
```

## Integration with VS Code

The fast development mode works well with VS Code:
- ✅ IntelliSense and TypeScript checking
- ✅ Debugging with breakpoints
- ✅ Hot reload without conflicts
- ✅ Lower resource usage (no webpack processes)

## Next Steps

- Consider migrating to Vite for even better performance (experimental)
- Add watch mode for library dependencies
- Implement incremental builds for large codebases