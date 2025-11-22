# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## 📁 Key Files to Know

- `src/main.tsx` - Application entry point
- `src/app/store.ts` - Redux store configuration
- `src/app/routes.tsx` - Route definitions
- `src/utils/axiosClient.ts` - HTTP client setup
- `src/utils/caching.ts` - Caching utility

## 🎯 Next Steps

1. Configure your API endpoint in `.env`
2. Customize theme colors in `tailwind.config.js`
3. Add your API integration logic
4. Start building features!

For more details, see [README.md](./README.md)


