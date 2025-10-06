# Quick Reference Guide

## 🎯 Project Overview

A modular YouTube clone with complete error handling, built with React Native, Expo, and TypeScript.

## 📁 File Structure Summary

```
├── api/api-client.ts           # All API calls with error handling
├── components/                 # Reusable UI components
├── config/api.config.ts        # Environment configuration
├── constants/data.ts           # Static data & constants
├── hooks/useApi.ts             # Custom API hook
├── navigation/AppNavigator.tsx # Navigation setup
├── screens/                    # All app screens
├── types/navigation.ts         # TypeScript types
├── utils/format.ts             # Utility functions
├── .env                        # Environment variables (NOT in Git)
└── App.tsx                     # Root component
```

## 🔧 Essential Commands

```bash
# Start development
npm start

# iOS
npm run ios

# Android
npm run android

# Clear cache
expo start -c

# Install dependencies
npm install

# Check TypeScript
npx tsc --noEmit
```

## 🌐 API Functions

All functions in `api/api-client.ts`:

| Function                  | Parameters           | Returns           |
| ------------------------- | -------------------- | ----------------- |
| `fetchTrendingVideos()`   | `params?`            | Trending videos   |
| `fetchVideoDetails()`     | `videoId`            | Video details     |
| `searchVideos()`          | `query, params?`     | Search results    |
| `fetchChannelDetails()`   | `channelId`          | Channel info      |
| `fetchRelatedVideos()`    | `videoId, params?`   | Related videos    |
| `fetchComments()`         | `videoId, params?`   | Video comments    |
| `fetchChannelVideos()`    | `channelId, params?` | Channel videos    |
| `fetchChannelPlaylists()` | `channelId, params?` | Channel playlists |

### API Response Structure

```typescript
{
  data: T | null,
  error: string | null,
  isError: boolean
}
```

## 🎨 Key Components

### ErrorBoundary

Catches React errors globally

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### LoadingScreen

Shows loading state

```tsx
<LoadingScreen message="Loading..." />
```

### ErrorMessage

Displays errors with retry

```tsx
<ErrorMessage message="Error message" onRetry={() => {}} />
```

### VideoCard

Reusable video card component

```tsx
<VideoCard
  videoId="..."
  title="..."
  onPress={() => {}}
  onChannelPress={() => {}}
/>
```

### SkeletonLoader

Loading placeholders

```tsx
<SkeletonLoader width={100} height={20} />
<VideoCardSkeleton />
<ChannelSkeleton />
```

## 🪝 Custom Hooks

### useApi Hook

```typescript
const { data, loading, error, execute, reset } = useApi(apiFunction);

// Execute API call
useEffect(() => {
  execute(params);
}, []);

// Reset state
reset();
```

## 🎯 Navigation

### Navigate to Screen

```typescript
navigation.navigate("ScreenName", { param: value });
```

### Go Back

```typescript
navigation.goBack();
```

### Push (for same screen)

```typescript
navigation.push("VideoDetails", { videoId: "abc" });
```

## 🎨 Styling Reference

### Colors

```typescript
const colors = {
  background: "#0f0f0f",
  secondary: "#272727",
  text: "#f1f1f1",
  textSecondary: "#aaaaaa",
  accent: "#ff0000",
  border: "#282828",
};
```

### Common Styles

```typescript
container: { flex: 1, backgroundColor: "#0f0f0f" }
header: { paddingHorizontal: 16, paddingBottom: 8 }
text: { color: "#f1f1f1", fontSize: 14 }
button: { backgroundColor: "#ff0000", borderRadius: 20 }
```

## 🔒 Environment Variables

In `.env` file:

```env
EXPO_PUBLIC_RAPIDAPI_KEY=your_key
EXPO_PUBLIC_RAPIDAPI_HOST=youtube138.p.rapidapi.com
```

Access in code:

```typescript
process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
```

## 🚨 Error Handling Pattern

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const result = await apiFunction();

    if (result.isError) {
      setError(result.error);
    } else {
      setData(result.data);
    }
  } catch (err) {
    setError("Unexpected error occurred");
  } finally {
    setLoading(false);
  }
};
```

## 🔄 Common Patterns

### Retry Logic

```typescript
const handleRetry = async () => {
  await fetchData();
};
```

### Pull to Refresh

```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
};

<ScrollView refreshControl={
  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
}>
```

### Format Numbers

```typescript
import { formatViewCount, formatNumber } from "../utils/format";

formatViewCount("1000000"); // "1.0M views"
formatNumber("5000"); // "5K"
```

## 📱 Screen Navigation Map

```
Home
├── VideoDetails
│   ├── Channel
│   └── VideoDetails (related videos)
├── Channel
│   └── VideoDetails
└── Search
    ├── VideoDetails
    └── Channel
```

## 🐛 Quick Debug Checklist

- [ ] Is `.env` file present with correct API key?
- [ ] Are all dependencies installed? (`npm install`)
- [ ] Is development server running? (`npm start`)
- [ ] Check console for errors (CMD+J / CTRL+J)
- [ ] Try clearing cache (`expo start -c`)
- [ ] Check API rate limits (RapidAPI dashboard)
- [ ] Verify network connection
- [ ] Check image URLs are valid
- [ ] Ensure all imports are correct

## 📊 Performance Tips

1. **Use FlashList** instead of FlatList
2. **Memoize** expensive computations
3. **Optimize images** with proper resizeMode
4. **Implement pagination** for long lists
5. **Cache API responses** to reduce requests
6. **Use React.memo** for components
7. **Lazy load** images and data

## 🎓 Learning Resources

- **React Native**: [reactnative.dev](https://reactnative.dev)
- **Expo**: [docs.expo.dev](https://docs.expo.dev)
- **React Navigation**: [reactnavigation.org](https://reactnavigation.org)
- **TypeScript**: [typescriptlang.org](https://typescriptlang.org)
- **FlashList**: [shopify.github.io/flash-list](https://shopify.github.io/flash-list)

## 💡 Pro Tips

1. **Always handle errors** - Free API can fail
2. **Use TypeScript strictly** - Catch bugs early
3. **Test on real devices** - Simulators aren't perfect
4. **Keep components small** - Easier to maintain
5. **Use constants** - Don't hardcode values
6. **Log errors** - Use console.error for debugging
7. **Comment complex code** - Future you will thank you
8. **Version control** - Commit frequently
9. **Read error messages** - They usually tell you what's wrong
10. **Ask for help** - Community is helpful

## 📞 Support Channels

- **Expo Forums**: [forums.expo.dev](https://forums.expo.dev)
- **Stack Overflow**: Tag with `expo`, `react-native`
- **GitHub Issues**: Create detailed bug reports
- **Discord**: Expo & React Native communities

## 🚀 Quick Start (TL;DR)

```bash
# 1. Create project
npx create-expo-app youtube-clone --template expo-template-blank-typescript
cd youtube-clone

# 2. Install dependencies
npm install axios @react-navigation/native @react-navigation/native-stack @shopify/flash-list
npx expo install react-native-screens react-native-safe-area-context

# 3. Create .env file
echo "EXPO_PUBLIC_RAPIDAPI_KEY=your_key" > .env
echo "EXPO_PUBLIC_RAPIDAPI_HOST=youtube138.p.rapidapi.com" >> .env

# 4. Copy all provided files to correct locations

# 5. Start development
npm start
```

---

**Quick Tip**: Bookmark this page for instant reference! 🔖
