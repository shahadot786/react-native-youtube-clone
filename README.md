# YouTube Clone - React Native

A fully functional YouTube clone built with React Native, Expo, and TypeScript. Features include video browsing, search, channel viewing, and more.

## Features

- ✅ Browse trending videos
- ✅ Video details with related videos and comments
- ✅ Channel pages with videos and playlists
- ✅ Search functionality
- ✅ Comprehensive error handling
- ✅ Loading states and retry mechanisms
- ✅ Environment variable configuration
- ✅ Modular architecture

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **FlashList** - Performant lists
- **RapidAPI YouTube v3** - Video data

## Project Structure

```
├── api/
│   └── api-client.ts          # API calls with error handling
├── components/
│   ├── ErrorBoundary.tsx      # Error boundary component
│   ├── ErrorMessage.tsx       # Error display component
│   ├── LoadingScreen.tsx      # Loading indicator
│   └── VideoCard.tsx          # Reusable video card
├── config/
│   └── api.config.ts          # API configuration
├── constants/
│   └── data.ts                # Static data and constants
├── navigation/
│   └── AppNavigator.tsx       # Navigation setup
├── screens/
│   ├── HomeScreen.tsx         # Home/trending videos
│   ├── VideoDetailsScreen.tsx # Video player and details
│   ├── ChannelScreen.tsx      # Channel information
│   └── SearchScreen.tsx       # Search functionality
├── types/
│   └── navigation.ts          # TypeScript types
├── utils/
│   └── format.ts              # Formatting utilities
├── .env                       # Environment variables
└── App.tsx                    # Root component
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or Expo Go app)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/shahadot786/react-native-youtube-clone.git
cd react-native-youtube-clone
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
EXPO_PUBLIC_RAPIDAPI_HOST=youtube138.p.rapidapi.com
```

**Note:** Replace `your_rapidapi_key_here` with your actual RapidAPI key. Get one at [RapidAPI YouTube v3](https://rapidapi.com/ytdlfree/api/youtube-v31).

4. **Start the development server**

```bash
npm start
# or
expo start
```

5. **Run on device/simulator**

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Required Dependencies

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "axios": "^1.6.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-screens": "^3.29.0",
    "@shopify/flash-list": "^1.6.0",
    "@expo/vector-icons": "^14.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.1.0"
  }
}
```

## API Information

This app uses the **YouTube v3 API** from RapidAPI. The free tier has rate limits:

- **500 requests per month** (free tier)
- Handle errors gracefully as API may fail
- Implement retry mechanisms for failed requests
- Cache responses when possible

## Error Handling

The app implements comprehensive error handling:

1. **Error Boundary**: Catches React component errors
2. **API Error Handling**: All API calls return structured responses with error information
3. **Loading States**: Shows loading indicators during data fetching
4. **Retry Mechanisms**: Users can retry failed requests
5. **Empty States**: Friendly messages when no data is available

## Features in Detail

### Home Screen

- Displays trending videos
- Category filtering
- Pull-to-refresh
- Navigation to video details

### Video Details Screen

- Video player placeholder
- Video information (title, views, date)
- Channel information
- Action buttons (like, share, download, save)
- Related videos tab
- Comments tab
- Full description toggle

### Channel Screen

- Channel banner and avatar
- Subscriber count and video count
- Subscribe button
- Videos tab
- Playlists tab

### Search Screen

- Real-time search
- Search results with thumbnails
- Filter by videos only
- Empty state handling

## Environment Variables

| Variable                    | Description                          | Required |
| --------------------------- | ------------------------------------ | -------- |
| `EXPO_PUBLIC_RAPIDAPI_KEY`  | Your RapidAPI key                    | Yes      |
| `EXPO_PUBLIC_RAPIDAPI_HOST` | API host (youtube138.p.rapidapi.com) | Yes      |

## Common Issues

### API Rate Limit Exceeded

- **Solution**: Wait for the rate limit to reset or upgrade your RapidAPI plan

### Network Error

- **Solution**: Check your internet connection and API key configuration

### Module Not Found

- **Solution**: Run `npm install` or `yarn install` again

### Expo Build Issues

- **Solution**: Clear cache with `expo start -c`

## Performance Optimizations

- **FlashList**: Used instead of FlatList for better performance
- **Image Caching**: Images are automatically cached
- **Lazy Loading**: Data is loaded on demand
- **Debounced Search**: Prevents excessive API calls

## Future Enhancements

- [ ] Video playback integration
- [ ] User authentication
- [ ] Playlist creation
- [ ] Watch history
- [ ] Subscriptions feed
- [ ] Dark/Light theme toggle
- [ ] Offline mode
- [ ] Share to social media

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes only. YouTube and its logo are trademarks of Google LLC.

## Acknowledgments

- [RapidAPI](https://rapidapi.com/) for the YouTube API
- [Expo](https://expo.dev/) for the development platform
- [React Navigation](https://reactnavigation.org/) for navigation

## Support

For issues and questions:

- Open an issue on GitHub
- Check the [RapidAPI documentation](https://rapidapi.com/ytdlfree/api/youtube-v31)
- Review the [Expo documentation](https://docs.expo.dev/)

---

**Note**: This is a clone project for learning purposes. Always respect YouTube's terms of service and API usage guidelines.
