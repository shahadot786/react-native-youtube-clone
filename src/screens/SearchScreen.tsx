import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchVideos } from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";

interface SearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  viewCount: string;
  publishedTimeText: string;
  thumbnail: { url: string }[];
  channelThumbnail: { url: string }[];
}

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const result = await searchVideos(searchQuery);

      if (result.isError) {
        setError(result.error || "Failed to search videos");
        setResults([]);
      } else {
        // Filter only video results
        const videoResults = (result.data || []).filter(
          (item: any) => item.type === "video"
        );
        setResults(videoResults);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleVideoPress = (videoId: string) => {
    navigation.navigate("VideoDetails", { videoId });
  };

  const handleChannelPress = (channelId: string) => {
    navigation.navigate("Channel", { channelId });
  };

  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleVideoPress(item.videoId)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.thumbnail?.[0]?.url || "" }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <TouchableOpacity
          style={styles.channelInfo}
          onPress={() => handleChannelPress(item.channelId)}
        >
          <Image
            source={{ uri: item.channelThumbnail?.[0]?.url || "" }}
            style={styles.channelAvatar}
          />
          <Text style={styles.channelName}>{item.channelTitle}</Text>
        </TouchableOpacity>
        <Text style={styles.resultMeta}>
          {formatViewCount(item.viewCount)} • {item.publishedTimeText}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-vertical" size={18} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search YouTube"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ff0000" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleSearch} />
      ) : !hasSearched ? (
        <View style={styles.centerContainer}>
          <Feather name="search" size={64} color="#666" />
          <Text style={styles.emptyText}>Search for videos</Text>
          <Text style={styles.emptySubtext}>
            Enter a search term to find videos
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="video-off" size={64} color="#666" />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>
            Try different keywords or check your spelling
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => `${item.videoId}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#0f0f0f",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#272727",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f1f1f1",
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
  },
  emptyText: {
    color: "#f1f1f1",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  listContainer: {
    padding: 12,
  },
  resultCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  thumbnail: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "flex-start",
  },
  resultTitle: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 8,
  },
  channelInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  channelAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#282828",
    marginRight: 6,
  },
  channelName: {
    color: "#aaa",
    fontSize: 12,
  },
  resultMeta: {
    color: "#aaa",
    fontSize: 11,
  },
  moreButton: {
    padding: 4,
  },
});
