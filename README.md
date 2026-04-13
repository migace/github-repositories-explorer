# GitHub Repositories Explorer

A React Native mobile application for searching GitHub users and exploring their repositories. Built with Expo, TypeScript, and Material Design 3.

![github-explorer-demo](https://github.com/user-attachments/assets/7a5d4eb5-e489-4b4a-86e6-946f0770c148)

## Features

- **User Search** - Search GitHub users with debounced input and search history
- **Repository Browser** - Browse user repositories with infinite scroll pagination
- **Sort & Filter** - Sort by stars, name, or update date; filter by programming language
- **Repository Details** - View stats (stars, forks, issues), topics, dates, and open on GitHub
- **Dark / Light Theme** - GitHub-inspired color palette with persistent theme preference
- **Offline Support** - Query cache persisted to AsyncStorage for offline access
- **Performance** - FlashList virtualization, memoized components, optimized image loading

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.83 + Expo 55 |
| Language | TypeScript 5.9 (strict mode) |
| Navigation | Expo Router (file-based, typed routes) |
| Server State | TanStack React Query 5 with AsyncStorage persistence |
| UI Library | React Native Paper (Material Design 3) |
| Lists | @shopify/flash-list |
| Testing | Jest + React Testing Library |
| Linting | ESLint + Prettier |

## Architecture

```
app/
  ├── services/              # API abstraction layer (GithubService)
  ├── index.tsx              # Home screen - user search
  ├── repository-details.tsx # Repository list with sort/filter
  ├── repository-detail.tsx  # Individual repository details
  └── _layout.tsx            # Providers, theme, query client
components/
  ├── github-users/          # User search feature
  │   ├── hooks/             # useUsers, useSearchHistory
  │   ├── github-users.tsx   # User list (FlashList)
  │   └── search-users.tsx   # Search input with history
  ├── repository-details/    # Repository feature
  │   ├── hooks/             # useUserRepositories, useSortFilter
  │   ├── repositories-list.tsx
  │   ├── repository-item.tsx
  │   └── sort-filter-bar.tsx
  ├── error-boundary.tsx     # Error boundary wrapper
  ├── error-state.tsx        # Error UI component
  └── loading-state.tsx      # Loading UI component
contexts/
  └── theme-context.tsx      # Dark/light theme with persistence
hooks/
  └── use-debounce.ts        # Generic debounce hook
types/
  ├── dto.ts                 # GitHub API response types
  └── github.ts              # Domain types
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/migace/github-repositories-explorer.git
cd github-repositories-explorer

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_GITHUB_API_URL` | GitHub API base URL | Yes |
| `EXPO_PUBLIC_GITHUB_TOKEN` | Personal access token ([generate here](https://github.com/settings/tokens)) - increases rate limit from 60 to 5,000 req/h | No |

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Running Tests

```bash
npm test
```

## Key Design Decisions

- **React Query over Redux** - Server state management with built-in caching, deduplication, and background refetching. No boilerplate for async operations.
- **FlashList over FlatList** - Shopify's high-performance list component for smoother scrolling with large datasets.
- **Feature-based structure** - Components, hooks, and tests co-located by feature rather than by type, improving discoverability.
- **Service abstraction** - `GithubService` class encapsulates all API calls with generic typing, auth handling, and error management.
- **Smart retry strategy** - React Query configured to skip retries on 403/429 (rate limit) responses while retrying transient failures.

## License

MIT
