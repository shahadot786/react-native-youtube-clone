/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fetchChannelDetails,
  fetchChannelPlaylists,
  fetchChannelVideos,
} from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingScreen } from "../components/LoadingScreen";

interface ChannelDetails {
  channelId: string;
  title: string;
  avatar: { url: string }[];
  banner: { url: string }[];
  subscriberCountText: string;
  videosCountText: string;
  description: string;
}

const ChannelScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { channelId } = route.params as { channelId: string };

  const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(
    null
  );
  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchData();
  }, [channelId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [detailsResult, videosResult, playlistsResult] = await Promise.all([
        fetchChannelDetails(channelId),
        fetchChannelVideos(channelId),
        fetchChannelPlaylists(channelId),
      ]);

      if (detailsResult.isError) {
        setError(detailsResult.error || "Failed to load channel");
      } else {
        setChannelDetails(detailsResult.data);
      }

      if (!videosResult.isError) {
        setVideos(videosResult.data || []);
      }

      if (!playlistsResult.isError) {
        setPlaylists(playlistsResult.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching channel data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: string): string => {
    const match = num.match(/[\d.]+/);
    if (!match) return num;
    const number = parseFloat(match[0]);
    if (num.includes("M")) return `${number}M`;
    if (num.includes("K")) return `${number}K`;
    return num;
  };

  const handleVideoPress = (videoId: string) => {
    navigation.navigate("VideoDetails", { videoId });
  };

  if (loading) {
    return <LoadingScreen message="Loading channel..." />;
  }

  if (error || !channelDetails) {
    return (
      <ErrorMessage
        message={error || "Channel not found"}
        onRetry={fetchData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <MaterialIcons name="cast" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="search" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="more-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        {channelDetails.banner?.[0]?.url && (
          <Image
            source={{ uri: channelDetails.banner[0].url }}
            style={styles.banner}
            resizeMode="cover"
          />
        )}

        {/* Channel Info */}
        <View style={styles.channelInfo}>
          <Image
            source={{ uri: channelDetails.avatar?.[0]?.url || "" }}
            style={styles.channelAvatar}
          />
          <Text style={styles.channelName}>{channelDetails.title}</Text>
          <Text style={styles.channelStats}>
            {channelDetails.subscriberCountText} •{" "}
            {channelDetails.videosCountText}
          </Text>
          {channelDetails.description && (
            <Text style={styles.channelDescription} numberOfLines={2}>
              {channelDetails.description}
            </Text>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                isSubscribed && styles.subscribedBtn,
              ]}
              onPress={() => setIsSubscribed(!isSubscribed)}
            >
              <Text
                style={[
                  styles.subscribeBtnText,
                  isSubscribed && styles.subscribedBtnText,
                ]}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "videos" && styles.tabActive]}
            onPress={() => setActiveTab("videos")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "videos" && styles.tabTextActive,
              ]}
            >
              Videos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "playlists" && styles.tabActive]}
            onPress={() => setActiveTab("playlists")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "playlists" && styles.tabTextActive,
              ]}
            >
              Playlists
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "videos" ? (
          <View style={styles.contentSection}>
            {videos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="video-off" size={48} color="#666" />
                <Text style={styles.emptyText}>No videos available</Text>
              </View>
            ) : (
              videos.map((video, index) => (
                <TouchableOpacity
                  key={`${video.videoId}-${index}`}
                  style={styles.videoCard}
                  onPress={() => handleVideoPress(video.videoId)}
                >
                  <Image
                    source={{ uri: video.thumbnail?.[0]?.url || "" }}
                    style={styles.videoThumbnail}
                  />
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoMeta}>
                      {formatNumber(video.viewCount)} views •{" "}
                      {video.publishedTimeText}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Feather name="more-vertical" size={18} color="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <View style={styles.contentSection}>
            {playlists.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="playlist-play" size={48} color="#666" />
                <Text style={styles.emptyText}>No playlists available</Text>
              </View>
            ) : (
              playlists.map((playlist, index) => (
                <TouchableOpacity
                  key={`${playlist.playlistId}-${index}`}
                  style={styles.playlistCard}
                >
                  <View style={styles.playlistThumbnailContainer}>
                    <Image
                      source={{ uri: playlist.thumbnail?.[0]?.url || "" }}
                      style={styles.playlistThumbnail}
                    />
                    <View style={styles.playlistOverlay}>
                      <MaterialIcons
                        name="playlist-play"
                        size={24}
                        color="white"
                      />
                      <Text style={styles.playlistCount}>
                        {playlist.videoCount}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.playlistTitle} numberOfLines={2}>
                    {playlist.title}
                  </Text>
                  <Text style={styles.playlistMeta}>View full playlist</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ChannelScreen;

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
  headerRight: {
    flexDirection: "row",
    gap: 20,
  },
  banner: {
    width: "100%",
    aspectRatio: 16 / 5,
    backgroundColor: "#282828",
  },
  channelInfo: {
    padding: 16,
    alignItems: "center",
  },
  channelAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#282828",
    marginBottom: 12,
  },
  channelName: {
    color: "#f1f1f1",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  channelStats: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 8,
  },
  channelDescription: {
    color: "#f1f1f1",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  subscribeBtn: {
    backgroundColor: "#ff0000",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  subscribedBtn: {
    backgroundColor: "#272727",
  },
  subscribeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  subscribedBtnText: {
    color: "#f1f1f1",
  },
  iconButton: {
    backgroundColor: "#272727",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#272727",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#f1f1f1",
  },
  tabText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#f1f1f1",
  },
  contentSection: {
    padding: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    marginTop: 12,
  },
  videoCard: {
    flexDirection: "row",
    marginBottom: 12,
  },
  videoThumbnail: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "flex-start",
  },
  videoTitle: {
    color: "#f1f1f1",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 4,
  },
  videoMeta: {
    color: "#aaa",
    fontSize: 11,
  },
  moreButton: {
    padding: 4,
  },
  playlistCard: {
    marginBottom: 16,
  },
  playlistThumbnailContainer: {
    position: "relative",
  },
  playlistThumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  playlistOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "40%",
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  playlistCount: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  playlistTitle: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    marginTop: 8,
  },
  playlistMeta: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
});
