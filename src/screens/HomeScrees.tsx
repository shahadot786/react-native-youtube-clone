/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchHashtagVideo, fetchTrendingVideos } from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";
import { VideoCardSkeleton } from "../components/SkeletonLoader";
import { VideoCard } from "../components/VideoCard";
import { TAGS } from "../constants/data";

interface Video {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  viewCount: string;
  publishedTimeText: string;
  thumbnail: { url: string }[];
  channelAvatar: { url: string }[];
  lengthText: string;
}

interface Items {
  id: string;
  title: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTag, setSelectedTag] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trending videos
  const loadTrendingVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTrendingVideos();
      if (result.isError) {
        setError(result.error);
        setVideos([]);
      } else {
        setVideos(result.data || []);
      }
    } catch (err) {
      setError("Failed to fetch videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch videos by tag
  const loadVideosByTag = useCallback(async (tag: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHashtagVideo(tag.toLowerCase());
      if (result.isError) {
        setError(result.error);
        setVideos([]);
      } else {
        setVideos(result.data || []);
      }
    } catch (err) {
      setError("Failed to fetch videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - fetch trending videos
  useEffect(() => {
    loadTrendingVideos();
  }, []);

  // Fetch videos when tag changes
  useEffect(() => {
    if (selectedTag === "All") {
      loadTrendingVideos();
    } else {
      loadVideosByTag(selectedTag);
    }
  }, [selectedTag]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedTag === "All") {
      await loadTrendingVideos();
    } else {
      await loadVideosByTag(selectedTag);
    }
    setRefreshing(false);
  }, [selectedTag]);

  const handleVideoPress = (video: Video) => {
    navigation.navigate("VideoDetails", {
      videoId: video.videoId,
      channelId: video.channelId,
    });
  };

  const handleChannelPress = (channelId: string) => {
    navigation.navigate("Channel", { channelId });
  };

  const handleTagPress = (item: Items) => {
    setSelectedTag(item.title);
  };

  const renderSkeletons = () => (
    <>
      <VideoCardSkeleton />
      <VideoCardSkeleton />
      <VideoCardSkeleton />
    </>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.header}>
          <View style={styles.leftSection}>
            <Image
              source={require("../../assets/youtube.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>YouTube</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity>
              <MaterialIcons name="cast" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="bell" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Feather name="search" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: "https://i.pravatar.cc/100?img=12" }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <ScrollView contentContainerStyle={styles.skeletonContainer}>
          {renderSkeletons()}
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.header}>
          <View style={styles.leftSection}>
            <Image
              source={require("../../assets/youtube.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>YouTube</Text>
          </View>
        </SafeAreaView>
        <ErrorMessage
          message={error}
          onRetry={() => {
            if (selectedTag === "All") {
              loadTrendingVideos();
            } else {
              loadVideosByTag(selectedTag);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.leftSection}>
          <Image
            source={require("../../assets/youtube.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>YouTube</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity>
            <MaterialIcons name="cast" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="bell" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Feather name="search" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=12" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Categories Bar */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.TagContainer}
        >
          {TAGS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.TagItem,
                selectedTag === item.title && styles.TagItemActive,
              ]}
              onPress={() => handleTagPress(item)}
            >
              <Text
                style={[
                  styles.TagText,
                  selectedTag === item.title && styles.TagTextActive,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Videos List */}
      <FlashList
        data={videos || []}
        renderItem={({ item }) => (
          <VideoCard
            videoId={item.videoId}
            title={item.title}
            channelTitle={item.channelTitle}
            channelId={item.channelId}
            viewCount={item.viewCount}
            lengthText={item.lengthText}
            publishedTimeText={item.publishedTimeText}
            thumbnail={item.thumbnail?.[2]?.url || ""}
            channelThumbnail={item.channelAvatar?.[0]?.url || ""}
            onPress={() => handleVideoPress(item)}
            onChannelPress={() => handleChannelPress(item.channelId)}
            onMorePress={() => {}}
          />
        )}
        keyExtractor={(item: Video) => item.videoId}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={["#ff0000"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="video-off" size={48} color="#666" />
            <Text style={styles.emptyText}>No videos available</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#0f0f0f",
    marginTop: 15,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 24,
    marginRight: 4,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  categoriesWrapper: {
    backgroundColor: "#0f0f0f",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
  },
  TagContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  TagItem: {
    backgroundColor: "#272727",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  TagItemActive: {
    backgroundColor: "#f1f1f1",
  },
  TagText: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
  },
  TagTextActive: {
    color: "#0f0f0f",
  },
  skeletonContainer: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
  },
});
