/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchPlaylistDetails } from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingScreen } from "../components/LoadingScreen";
import { formatNumber } from "../utils/format";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageUrl {
  url: string;
}

interface Video {
  videoId: string;
  title: string;
  thumbnail: ImageUrl[];
  lengthText?: string;
  viewCount?: number;
  publishedTimeText?: string;
  index?: number;
}

interface PlaylistAuthor {
  channelId: string;
  name: string;
  avatar?: ImageUrl[];
}

interface PlaylistDetails {
  playlistId: string;
  title: string;
  description?: string;
  thumbnail: ImageUrl[];
  videoCount: number;
  viewCount?: number;
  lastUpdated?: string;
  author?: PlaylistAuthor;
  videos: Video[];
}

const PlaylistDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { playlistId } = route.params as { playlistId: string };

  const [playlistData, setPlaylistData] = useState<PlaylistDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);

  useEffect(() => {
    fetchData();
  }, [playlistId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchPlaylistDetails(playlistId);

      if (result.isError) {
        setError(result.error || "Failed to load playlist");
      } else {
        setPlaylistData(result.data);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = useCallback(
    (videoId: string, index: number) => {
      navigation.navigate("VideoDetails", {
        videoId,
        playlistId,
        playlistIndex: index,
      });
    },
    [navigation, playlistId]
  );

  const handleChannelPress = useCallback(() => {
    if (playlistData?.author?.channelId) {
      navigation.navigate("Channel", {
        channelId: playlistData.author.channelId,
      });
    }
  }, [navigation, playlistData]);

  const handlePlayAll = useCallback(() => {
    if (playlistData?.videos?.[0]) {
      handleVideoPress(playlistData.videos[0].videoId, 0);
    }
  }, [playlistData, handleVideoPress]);

  const handleShuffle = useCallback(() => {
    setIsShuffleMode(!isShuffleMode);
    if (playlistData?.videos) {
      const randomIndex = Math.floor(
        Math.random() * playlistData.videos.length
      );
      handleVideoPress(playlistData.videos[randomIndex].videoId, randomIndex);
    }
  }, [isShuffleMode, playlistData, handleVideoPress]);

  const renderHeader = useMemo(() => {
    if (!playlistData) return null;

    return (
      <View style={styles.headerContainer}>
        {/* Playlist Cover with Gradient */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: playlistData.thumbnail?.[0]?.url || "" }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(15,15,15,0.9)", "#0f0f0f"]}
            style={styles.gradient}
          />

          <View style={styles.coverOverlay}>
            <View style={styles.playlistBadge}>
              <MaterialIcons name="playlist-play" size={20} color="white" />
              <Text style={styles.badgeText}>Playlist</Text>
            </View>
          </View>
        </View>

        {/* Playlist Info */}
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistTitle}>{playlistData.title}</Text>

          {/* Author Info */}
          {playlistData.author && (
            <TouchableOpacity
              style={styles.authorContainer}
              onPress={handleChannelPress}
            >
              {playlistData.author.avatar?.[0]?.url && (
                <Image
                  source={{ uri: playlistData.author.avatar[0].url }}
                  style={styles.authorAvatar}
                />
              )}
              <Text style={styles.authorName}>{playlistData.author.name}</Text>
              <Feather name="chevron-right" size={16} color="#aaa" />
            </TouchableOpacity>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="video-library" size={16} color="#aaa" />
              <Text style={styles.statText}>
                {playlistData.videoCount} videos
              </Text>
            </View>
            {playlistData.viewCount && (
              <View style={styles.statItem}>
                <Feather name="eye" size={16} color="#aaa" />
                <Text style={styles.statText}>
                  {formatNumber(playlistData.viewCount)} views
                </Text>
              </View>
            )}
            {playlistData.lastUpdated && (
              <View style={styles.statItem}>
                <Feather name="clock" size={16} color="#aaa" />
                <Text style={styles.statText}>{playlistData.lastUpdated}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {playlistData.description && (
            <View style={styles.descriptionContainer}>
              <Text
                style={styles.description}
                numberOfLines={expandedDescription ? undefined : 3}
              >
                {playlistData.description}
              </Text>
              {playlistData.description.length > 150 && (
                <TouchableOpacity
                  onPress={() => setExpandedDescription(!expandedDescription)}
                >
                  <Text style={styles.showMoreText}>
                    {expandedDescription ? "Show less" : "Show more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePlayAll}
            >
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Play all</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleShuffle}
            >
              <Ionicons
                name="shuffle"
                size={20}
                color={isShuffleMode ? "#ff0000" : "white"}
              />
              <Text style={styles.secondaryButtonText}>Shuffle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconOnlyButton}>
              <Feather name="download" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconOnlyButton}>
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Videos Header */}
        <View style={styles.videosHeader}>
          <Text style={styles.videosHeaderText}>Videos</Text>
          <TouchableOpacity style={styles.sortButton}>
            <MaterialIcons name="sort" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    playlistData,
    expandedDescription,
    isShuffleMode,
    handleChannelPress,
    handlePlayAll,
    handleShuffle,
  ]);

  const renderVideoItem = useCallback(
    ({ item: video, index }: { item: Video; index: number }) => (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handleVideoPress(video.videoId, index)}
      >
        <View style={styles.videoIndex}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: video.thumbnail?.[0]?.url || "" }}
            style={styles.thumbnail}
          />
          {video.lengthText && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{video.lengthText}</Text>
            </View>
          )}
        </View>

        <View style={styles.videoDetails}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.videoMetaContainer}>
            {video.viewCount && (
              <Text style={styles.videoMeta}>
                {formatNumber(video.viewCount)} views
              </Text>
            )}
            {video.publishedTimeText && (
              <>
                {video.viewCount && <Text style={styles.metaDot}> • </Text>}
                <Text style={styles.videoMeta}>{video.publishedTimeText}</Text>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.videoMoreButton}>
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [handleVideoPress]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="playlist-play" size={64} color="#666" />
        <Text style={styles.emptyText}>No videos in this playlist</Text>
      </View>
    ),
    []
  );

  if (loading) {
    return <LoadingScreen message="Loading playlist..." />;
  }

  if (error || !playlistData) {
    return (
      <ErrorMessage
        message={error || "Playlist not found"}
        onRetry={fetchData}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="cast" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name="search" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name="more-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content */}
      <FlashList
        data={playlistData.videos || []}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => `${item.videoId}-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PlaylistDetailsScreen;

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
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  headerRight: {
    flexDirection: "row",
    gap: 20,
  },
  headerButton: {
    padding: 4,
  },
  headerContainer: {
    marginBottom: 8,
  },
  coverContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#282828",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  coverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    padding: 16,
  },
  playlistBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  playlistInfo: {
    padding: 16,
  },
  playlistTitle: {
    color: "#f1f1f1",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    lineHeight: 28,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#282828",
  },
  authorName: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#aaa",
    fontSize: 13,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 18,
  },
  showMoreText: {
    color: "#f1f1f1",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#ff0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#272727",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  iconOnlyButton: {
    backgroundColor: "#272727",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#272727",
    marginHorizontal: 16,
  },
  videosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  videosHeaderText: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "600",
  },
  sortButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 100,
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  videoIndex: {
    width: 24,
    alignItems: "center",
  },
  indexText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "500",
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: 120,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  durationText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  videoDetails: {
    flex: 1,
  },
  videoTitle: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 4,
  },
  videoMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoMeta: {
    color: "#aaa",
    fontSize: 12,
  },
  metaDot: {
    color: "#aaa",
    fontSize: 12,
  },
  videoMoreButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    marginTop: 16,
  },
});
