import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { validateApiConfig } from "../config/api.config";
import ChannelScreen from "../screens/ChannelScreen";
import HomeScreen from "../screens/HomeScrees";
import PlaylistDetailsScreen from "../screens/PlaylistDetails";
import SearchScreen from "../screens/SearchScreen";
import VideoDetailsScreen from "../screens/VideoDetailsScreen";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Ignore specific warnings
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function RootLayout() {
  useEffect(() => {
    // Validate API configuration on startup
    const isValid = validateApiConfig();
    if (!isValid) {
      console.warn("API configuration is invalid. Please check your .env file");
    }
  }, []);
  return (
    <ErrorBoundary>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#0f0f0f" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VideoDetails" component={VideoDetailsScreen} />
        <Stack.Screen name="Channel" component={ChannelScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
          name="PlaylistDetails"
          component={PlaylistDetailsScreen}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
