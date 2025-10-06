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

import { fetchTrendingVideos } from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";
import { VideoCardSkeleton } from "../components/SkeletonLoader";
import { VideoCard } from "../components/VideoCard";
import { CATEGORIES } from "../constants/data";
import { useApi } from "../hooks/useApi";

interface Video {
  videoId: string;
  title: string;
  author: string;
  channelId: string;
  viewCount: string;
  publishedText: string;
  videoThumbnails: { url: string }[];
  authorThumbnails: { url: string }[];
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const { data: videos, loading, error, execute } = useApi(fetchTrendingVideos);

  useEffect(() => {
    execute();
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await execute();
    setRefreshing(false);
  }, [execute]);

  const handleVideoPress = (video: Video) => {
    navigation.navigate("VideoDetails", { videoId: video.videoId });
  };

  const handleChannelPress = (channelId: string) => {
    navigation.navigate("Channel", { channelId });
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
        <ErrorMessage message={error} onRetry={execute} />
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
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryItem,
                selectedCategory === item.title && styles.categoryItemActive,
              ]}
              onPress={() => setSelectedCategory(item.title)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.title && styles.categoryTextActive,
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
            channelTitle={item.author}
            channelId={item.channelId}
            viewCount={item.viewCount}
            publishedTimeText={item.publishedText}
            thumbnail={item.videoThumbnails?.[1]?.url || ""}
            channelThumbnail={item.authorThumbnails?.[3]?.url || ""}
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
  categoryContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryItem: {
    backgroundColor: "#272727",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryItemActive: {
    backgroundColor: "#f1f1f1",
  },
  categoryText: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
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
