/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fetchChannelAbout,
  fetchChannelDetails,
  fetchChannelHome,
  fetchChannelPlaylists,
  fetchChannelVideos,
  fetchShortsVideos,
} from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";
import HomeContent from "../components/HomeContent";
import { LoadingScreen } from "../components/LoadingScreen";
import { formatNumber } from "../utils/format";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageUrl {
  url: string;
}

interface ChannelMeta {
  channelId: string;
  title: string;
  description: string;
  avatar: ImageUrl[];
  banner: ImageUrl[];
  channelHandle: string;
  subscriberCountText: string;
  videosCountText: string;
}

interface ChannelDetails {
  channelId: string;
  title: string;
  avatar: ImageUrl[];
  banner: ImageUrl[];
  subscriberCountText: string;
  videosCountText: string;
  description: string;
  meta: ChannelMeta;
}

interface Video {
  videoId: string;
  title: string;
  thumbnail: ImageUrl[];
  viewCount: number;
  publishedTimeText: string;
}

interface Playlist {
  playlistId: string;
  title: string;
  thumbnail: ImageUrl[];
  videoCount: number;
}

interface Short {
  videoId: string;
  title: string;
  thumbnail: ImageUrl[];
  viewCount?: number;
}

type TabType = "home" | "videos" | "shorts" | "playlists" | "about";

const ChannelScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { channelId } = route.params as { channelId: string };

  const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(
    null
  );
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [homeContent, setHomeContent] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [channelId]);

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const detailsResult = await fetchChannelDetails(channelId);

      if (detailsResult.isError) {
        setError(detailsResult.error || "Failed to load channel");
      } else {
        setChannelDetails(detailsResult.data);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    if (!channelDetails) return;

    try {
      setTabLoading(true);

      switch (activeTab) {
        case "home":
          const homeResult = await fetchChannelHome(channelId);
          // console.log(JSON.stringify(homeResult.data, null, 4), "home");
          if (!homeResult.isError) {
            setHomeContent(homeResult.data || []);
          }
          break;

        case "videos":
          const videosResult = await fetchChannelVideos(channelId);
          if (!videosResult.isError) {
            setVideos(videosResult.data || []);
          }
          break;

        case "shorts":
          const shortsResult = await fetchShortsVideos(channelId);
          if (!shortsResult.isError) {
            setShorts(shortsResult.data || []);
          }
          break;

        case "playlists":
          const playlistsResult = await fetchChannelPlaylists(channelId);
          if (!playlistsResult.isError) {
            setPlaylists(playlistsResult.data || []);
          }
          break;

        case "about":
          const aboutResult = await fetchChannelAbout(channelId);
          if (!aboutResult.isError) {
            setAboutData(aboutResult.data);
          }
          break;
      }
    } catch (err) {
      console.error("Error fetching tab data:", err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleVideoPress = useCallback(
    (videoId: string) => {
      navigation.navigate("VideoDetails", { videoId, channelId });
    },
    [navigation, channelId]
  );

  const handleSubscribePress = useCallback(() => {
    setIsSubscribed(!isSubscribed);
  }, [isSubscribed]);

  const handleTabPress = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const renderHeader = useMemo(() => {
    if (!channelDetails) return null;

    return (
      <View>
        {/* Banner */}
        {channelDetails.meta.banner?.[0]?.url && (
          <Image
            source={{ uri: channelDetails.meta.banner[0].url }}
            style={styles.banner}
            resizeMode="cover"
          />
        )}

        {/* Channel Info */}
        <View style={styles.channelInfo}>
          <Image
            source={{ uri: channelDetails.meta.avatar?.[1]?.url || "" }}
            style={styles.channelAvatar}
          />
          <Text style={styles.channelName}>{channelDetails.meta.title}</Text>
          <Text style={styles.channelHandle}>
            {channelDetails.meta.channelHandle}
          </Text>
          <Text style={styles.channelStats}>
            {channelDetails.meta.subscriberCountText} •{" "}
            {channelDetails.meta.videosCountText}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                isSubscribed && styles.subscribedBtn,
              ]}
              onPress={handleSubscribePress}
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

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(
            ["home", "videos", "shorts", "playlists", "about"] as TabType[]
          ).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [
    channelDetails,
    activeTab,
    isSubscribed,
    handleSubscribePress,
    handleTabPress,
  ]);

  const renderVideoItem = useCallback(
    ({ item: video }: { item: Video }) => (
      <TouchableOpacity
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
            {formatNumber(video.viewCount)} views • {video.publishedTimeText}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={18} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [handleVideoPress]
  );

  const renderShortItem = useCallback(
    ({ item: short }: { item: Short }) => (
      <TouchableOpacity
        style={styles.shortCard}
        onPress={() => handleVideoPress(short.videoId)}
      >
        <Image
          source={{ uri: short.thumbnail?.[0]?.url || "" }}
          style={styles.shortThumbnail}
        />
        <View style={styles.shortOverlay}>
          <MaterialIcons name="play-arrow" size={32} color="white" />
        </View>
        <Text style={styles.shortTitle} numberOfLines={2}>
          {short.title}
        </Text>
        {short.viewCount && (
          <Text style={styles.shortViews}>
            {formatNumber(short.viewCount)} views
          </Text>
        )}
      </TouchableOpacity>
    ),
    [handleVideoPress]
  );

  const handlePlaylistPress = useCallback(
    (playlistId: string) => {
      navigation.navigate("PlaylistDetails", { playlistId });
    },
    [navigation]
  );

  const renderPlaylistItem = useCallback(
    ({ item: playlist }: { item: Playlist }) => (
      <TouchableOpacity
        style={styles.playlistCard}
        onPress={() => handlePlaylistPress(playlist.playlistId)}
      >
        <View style={styles.playlistThumbnailContainer}>
          <Image
            source={{ uri: playlist.thumbnail?.[0]?.url || "" }}
            style={styles.playlistThumbnail}
          />
          <View style={styles.playlistOverlay}>
            <MaterialIcons name="playlist-play" size={24} color="white" />
            <Text style={styles.playlistCount}>{playlist.videoCount}</Text>
          </View>
        </View>
        <Text style={styles.playlistTitle} numberOfLines={2}>
          {playlist.title}
        </Text>
        <Text style={styles.playlistMeta}>View full playlist</Text>
      </TouchableOpacity>
    ),
    [handlePlaylistPress]
  );

  const renderAboutSection = useCallback(() => {
    if (!aboutData && !channelDetails) return null;

    const data = aboutData || channelDetails.meta;

    return (
      <View style={styles.aboutContainer}>
        <View style={styles.aboutSection}>
          <Text style={styles.aboutLabel}>Description</Text>
          <Text style={styles.aboutText}>
            {data.description || "No description available"}
          </Text>
        </View>

        {data.subscriberCountText && (
          <View style={styles.aboutSection}>
            <Text style={styles.aboutLabel}>Channel Details</Text>
            <Text style={styles.aboutText}>{data.subscriberCountText}</Text>
            <Text style={styles.aboutText}>{data.videosCountText}</Text>
          </View>
        )}

        {data.channelHandle && (
          <View style={styles.aboutSection}>
            <Text style={styles.aboutLabel}>Links</Text>
            <Text style={styles.aboutLink}>{data.channelHandle}</Text>
          </View>
        )}
      </View>
    );
  }, [aboutData, channelDetails]);

  const renderEmptyState = useCallback(() => {
    const emptyStates = {
      videos: { icon: "video-off", text: "No videos available" },
      shorts: { icon: "video-off", text: "No shorts available" },
      playlists: { icon: "playlist-play", text: "No playlists available" },
      home: { icon: "home", text: "No content available" },
      about: { icon: "info", text: "No information available" },
    };

    const state = emptyStates[activeTab];

    return (
      <View style={styles.emptyContainer}>
        {activeTab === "playlists" ? (
          <MaterialIcons name={state.icon as any} size={48} color="#666" />
        ) : (
          <Feather name={state.icon as any} size={48} color="#666" />
        )}
        <Text style={styles.emptyText}>{state.text}</Text>
      </View>
    );
  }, [activeTab]);

  const getContentData = useMemo(() => {
    switch (activeTab) {
      case "videos":
        return videos;
      case "shorts":
        return shorts;
      case "playlists":
        return playlists;
      default:
        return [];
    }
  }, [activeTab, videos, shorts, playlists]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      switch (activeTab) {
        case "videos":
          return renderVideoItem({ item });
        case "shorts":
          return renderShortItem({ item });
        case "playlists":
          return renderPlaylistItem({ item });
        default:
          return null;
      }
    },
    [activeTab, renderVideoItem, renderShortItem, renderPlaylistItem]
  );

  const getKeyExtractor = useCallback(
    (item: any, index: number) => {
      if (activeTab === "videos") return `video-${item.videoId}-${index}`;
      if (activeTab === "shorts") return `short-${item.videoId}-${index}`;
      if (activeTab === "playlists")
        return `playlist-${item.playlistId}-${index}`;
      return `item-${index}`;
    },
    [activeTab]
  );

  if (loading) {
    return <LoadingScreen message="Loading channel..." />;
  }

  if (error || !channelDetails) {
    return (
      <ErrorMessage
        message={error || "Channel not found"}
        onRetry={fetchInitialData}
      />
    );
  }
  const renderContent = () => {
    if (activeTab === "about") {
      return (
        <FlashList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={<>{renderAboutSection()}</>}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (activeTab === "home") {
      if (tabLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff0000" />
          </View>
        );
      }

      if (!Array.isArray(homeContent) || homeContent.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="home" size={48} color="#666" />
            <Text style={styles.emptyText}>No content available</Text>
          </View>
        );
      }

      return (
        <FlashList
          data={homeContent}
          renderItem={({ item: section }) => <HomeContent section={section} />}
          keyExtractor={(item, index) => `home-section-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flashListContent}
        />
      );
    }

    if (activeTab === "shorts") {
      return (
        <FlashList
          data={getContentData}
          renderItem={renderItem}
          keyExtractor={getKeyExtractor}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={tabLoading ? null : renderEmptyState}
          contentContainerStyle={styles.shortsListContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return (
      <FlashList
        data={getContentData}
        renderItem={renderItem}
        keyExtractor={getKeyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={tabLoading ? null : renderEmptyState}
        contentContainerStyle={styles.flashListContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

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

      {(activeTab === "home" || activeTab === "about") && renderHeader}
      {renderContent()}
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
    marginTop: 15,
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
  channelHandle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 4,
  },
  channelStats: {
    color: "#aaa",
    fontSize: 13,
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#f1f1f1",
  },
  tabText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#f1f1f1",
    fontWeight: "600",
  },
  flashListContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  shortsListContent: {
    paddingHorizontal: 4,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
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
    paddingHorizontal: 4,
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
  shortCard: {
    flex: 1,
    margin: 2,
    maxWidth: (SCREEN_WIDTH - 16) / 3,
  },
  shortThumbnail: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  shortOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  shortTitle: {
    color: "#f1f1f1",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
    lineHeight: 14,
  },
  shortViews: {
    color: "#aaa",
    fontSize: 10,
    marginTop: 2,
  },
  playlistCard: {
    marginBottom: 16,
    paddingHorizontal: 4,
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
  aboutContainer: {
    padding: 16,
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutLabel: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  aboutText: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  aboutLink: {
    color: "#3ea6ff",
    fontSize: 14,
    lineHeight: 20,
  },
  homeContentContainer: {
    padding: 16,
  },
  homeSection: {
    marginBottom: 24,
  },
  homeSectionTitle: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});
