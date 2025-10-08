/* eslint-disable react-hooks/exhaustive-deps */
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
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

// Types
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
  lengthText: string;
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

interface HomeSection {
  type: string;
  title?: string;
  subtitle?: string;
  data?: any[];
  videoId?: string;
  viewCount?: number;
  publishedTimeText?: string;
  description?: string;
}

type TabType = "home" | "videos" | "shorts" | "playlists" | "about";

const TABS: TabType[] = ["home", "videos", "shorts", "playlists", "about"];
const HEADER_HEIGHT = 250; // Channel info header height

const ChannelScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { channelId } = (route.params as { channelId?: string }) || {};

  // State management
  const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(
    null
  );
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [homeContent, setHomeContent] = useState<HomeSection[]>([]);
  const [aboutData, setAboutData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isTabsFixed, setIsTabsFixed] = useState(false);

  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;

  // Effects
  useEffect(() => {
    if (channelId) {
      fetchInitialData();
    }
  }, [channelId]);

  useEffect(() => {
    fetchTabData();
  }, [activeTab, channelId]);

  // API Calls
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!channelId) {
        setError("Channel ID is missing");
        return;
      }

      const detailsResult = await fetchChannelDetails(channelId);

      if (detailsResult?.isError) {
        setError(detailsResult.error || "Failed to load channel");
      } else if (detailsResult?.data) {
        setChannelDetails(detailsResult.data);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    if (!channelId) return;

    try {
      setTabLoading(true);

      switch (activeTab) {
        case "home": {
          const homeResult = await fetchChannelHome(channelId);
          if (!homeResult?.isError && Array.isArray(homeResult?.data)) {
            setHomeContent(homeResult.data);
          }
          break;
        }

        case "videos": {
          const videosResult = await fetchChannelVideos(channelId);
          if (!videosResult?.isError && Array.isArray(videosResult?.data)) {
            setVideos(videosResult.data);
          }
          break;
        }

        case "shorts": {
          const shortsResult = await fetchShortsVideos(channelId);
          if (!shortsResult?.isError && Array.isArray(shortsResult?.data)) {
            setShorts(shortsResult.data);
          }
          break;
        }

        case "playlists": {
          const playlistsResult = await fetchChannelPlaylists(channelId);
          if (
            !playlistsResult?.isError &&
            Array.isArray(playlistsResult?.data)
          ) {
            setPlaylists(playlistsResult.data);
          }
          break;
        }

        case "about": {
          const aboutResult = await fetchChannelAbout(channelId);
          if (!aboutResult?.isError && aboutResult?.data) {
            setAboutData(aboutResult.data);
          }
          break;
        }
      }
    } catch (err) {
      console.error("Error fetching tab data:", err);
    } finally {
      setTabLoading(false);
    }
  };

  // Handlers
  const handleVideoPress = useCallback((videoId: string, channelId: string) => {
    navigation.navigate("VideoDetails", { videoId, channelId });
  }, []);

  const handlePlaylistPress = useCallback((playlistId: string) => {
    navigation.navigate("PlaylistDetails", { playlistId });
  }, []);

  const handleSubscribePress = useCallback(() => {
    setIsSubscribed((prev) => !prev);
  }, []);

  const handleTabPress = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setIsTabsFixed(scrollPosition >= HEADER_HEIGHT);
    scrollY.setValue(scrollPosition);
  };

  // Render Methods
  const renderChannelHeader = useCallback(() => {
    if (!channelDetails?.meta) return null;

    const { meta } = channelDetails;
    const bannerUrl = meta.banner?.[0]?.url;
    const avatarUrl = meta.avatar?.[1]?.url || meta.avatar?.[0]?.url;

    return (
      <View style={styles.headerContainer}>
        {bannerUrl && (
          <Image
            source={{ uri: bannerUrl }}
            style={styles.banner}
            resizeMode="cover"
          />
        )}

        <View style={styles.channelInfoSection}>
          {avatarUrl && (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.channelAvatar}
              resizeMode="cover"
            />
          )}

          <Text style={styles.channelName}>{meta.title}</Text>

          {meta.channelHandle && (
            <Text style={styles.channelHandle}>{meta.channelHandle}</Text>
          )}

          <Text style={styles.channelStats}>
            {meta.subscriberCountText} • {meta.videosCountText}
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                isSubscribed && styles.subscribedBtn,
              ]}
              onPress={handleSubscribePress}
              activeOpacity={0.7}
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

            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Feather name="bell" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [channelDetails, isSubscribed, handleSubscribePress]);

  const renderTabs = useCallback(() => {
    return (
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
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
    );
  }, [activeTab, handleTabPress]);

  const renderVideoItem = useCallback(
    (item: Video, index: number) => (
      <TouchableOpacity
        key={`video-${item.videoId}-${index}`}
        style={styles.videoCard}
        onPress={() => handleVideoPress(item.videoId, channelId as string)}
        activeOpacity={0.7}
      >
        <View>
          <Image
            source={{ uri: item.thumbnail?.[0]?.url || "" }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          {item.lengthText && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{item.lengthText}</Text>
            </View>
          )}
        </View>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.videoMeta}>
            {formatNumber(item.viewCount)} views • {item.publishedTimeText}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleVideoPress]
  );

  const renderShortItem = useCallback(
    (item: Short, index: number) => (
      <TouchableOpacity
        key={`short-${item.videoId}-${index}`}
        style={styles.shortCard}
        onPress={() => handleVideoPress(item.videoId, channelId as string)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.thumbnail?.[0]?.url || "" }}
          style={styles.shortThumbnail}
          resizeMode="cover"
        />
        <View style={styles.shortOverlay}>
          <MaterialIcons name="play-arrow" size={32} color="white" />
        </View>
        <Text style={styles.shortTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.viewCount !== undefined && (
          <Text style={styles.shortViews}>
            {formatNumber(item.viewCount)} views
          </Text>
        )}
      </TouchableOpacity>
    ),
    [handleVideoPress]
  );

  const renderPlaylistItem = useCallback(
    (item: Playlist, index: number) => (
      <TouchableOpacity
        key={`playlist-${item.playlistId}-${index}`}
        style={styles.playlistCard}
        onPress={() => handlePlaylistPress(item.playlistId)}
        activeOpacity={0.7}
      >
        <View style={styles.playlistThumbnailContainer}>
          <Image
            source={{ uri: item.thumbnail?.[0]?.url || "" }}
            style={styles.playlistThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playlistOverlay}>
            <MaterialIcons name="playlist-play" size={24} color="white" />
            <Text style={styles.playlistCount}>{item.videoCount}</Text>
          </View>
        </View>
        <Text style={styles.playlistTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    ),
    [handlePlaylistPress]
  );

  const renderAboutContent = useCallback(() => {
    if (!channelDetails?.meta) return null;

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
            <Text style={styles.aboutLabel}>Handle</Text>
            <Text style={styles.aboutLink}>{data.channelHandle}</Text>
          </View>
        )}
      </View>
    );
  }, [channelDetails, aboutData]);

  const renderEmptyState = useCallback((message: string) => {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="inbox" size={48} color="#666" />
        <Text style={styles.emptyText}>{message}</Text>
      </View>
    );
  }, []);

  const renderTabContent = useCallback(() => {
    if (tabLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
          >
            {homeContent && homeContent.length > 0
              ? homeContent.map((section, index) => (
                  <HomeContent
                    key={`home-${index}`}
                    section={section}
                    channelId={channelId ?? ""}
                  />
                ))
              : renderEmptyState("No content available")}
            <View style={styles.bottomPadding} />
          </ScrollView>
        );

      case "videos":
        return (
          <FlashList
            data={videos}
            renderItem={({ item, index }) => renderVideoItem(item, index || 0)}
            keyExtractor={(item, index) => `video-${item.videoId}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flashListContent}
            ListEmptyComponent={() => renderEmptyState("No videos available")}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
          />
        );

      case "shorts":
        return (
          <FlashList
            data={shorts}
            renderItem={({ item, index }) => renderShortItem(item, index || 0)}
            keyExtractor={(item, index) => `short-${item.videoId}-${index}`}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.shortsListContent}
            ListEmptyComponent={() => renderEmptyState("No shorts available")}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
          />
        );

      case "playlists":
        return (
          <FlashList
            data={playlists}
            renderItem={({ item, index }) =>
              renderPlaylistItem(item, index || 0)
            }
            keyExtractor={(item, index) =>
              `playlist-${item.playlistId}-${index}`
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flashListContent}
            ListEmptyComponent={() =>
              renderEmptyState("No playlists available")
            }
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
          />
        );

      case "about":
        return (
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
          >
            {renderAboutContent()}
            <View style={styles.bottomPadding} />
          </ScrollView>
        );

      default:
        return null;
    }
  }, [
    activeTab,
    tabLoading,
    videos,
    shorts,
    playlists,
    homeContent,
    aboutData,
  ]);

  // Loading state
  if (loading) {
    return <LoadingScreen message="Loading channel..." />;
  }

  // Error state
  if (error || !channelDetails) {
    return (
      <ErrorMessage
        message={error || "Channel not found"}
        onRetry={fetchInitialData}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <SafeAreaView edges={["top"]} style={styles.headerTop}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons name="cast" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="search" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="more-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Channel Header (Scrollable with content) */}
      {!isTabsFixed && renderChannelHeader()}

      {/* Tabs (Sticky when header scrolls up) */}
      <View
        style={[
          styles.stickyTabsWrapper,
          isTabsFixed && styles.tabsFixedPosition,
        ]}
      >
        {renderTabs()}
      </View>

      {/* Content (Scrollable) */}
      {renderTabContent()}
    </View>
  );
};

export default ChannelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  headerTop: {
    backgroundColor: "#0f0f0f",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: "row",
    gap: 20,
  },

  // Sticky Tabs Wrapper
  stickyTabsWrapper: {
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 0.5,
    borderBottomColor: "#272727",
  },
  tabsFixedPosition: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 0.5,
    borderBottomColor: "#272727",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  // Channel Header Section
  headerContainer: {
    backgroundColor: "#0f0f0f",
  },
  banner: {
    width: "100%",
    aspectRatio: 16 / 5,
    backgroundColor: "#282828",
  },
  channelInfoSection: {
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
    fontWeight: "700",
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
    width: "100%",
    justifyContent: "center",
  },
  subscribeBtn: {
    backgroundColor: "#ff0000",
    paddingHorizontal: 28,
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

  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  // Tabs
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
    borderBottomWidth: 3,
    borderBottomColor: "#f1f1f1",
  },
  tabText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#f1f1f1",
    fontWeight: "700",
  },

  // Content
  contentContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    marginTop: 15,
  },
  flashListContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
    marginTop: 15,
  },
  shortsListContent: {
    paddingHorizontal: 6,
    paddingBottom: 100,
    marginTop: 15,
  },
  bottomPadding: {
    height: 100,
  },

  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },

  // Video Card
  videoCard: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 4,
    alignItems: "center",
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
    justifyContent: "center",
  },
  videoTitle: {
    color: "#f1f1f1",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 4,
  },
  videoMeta: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "500",
  },

  // Short Card
  shortCard: {
    flex: 1,
    margin: 2,
    maxWidth: (SCREEN_WIDTH - 16) / 3,
    backgroundColor: "#0f0f0f",
    borderRadius: 8,
    overflow: "hidden",
  },
  shortThumbnail: {
    width: "100%",
    aspectRatio: 9 / 16,
    backgroundColor: "#282828",
    borderRadius: 8,
  },
  shortOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  shortTitle: {
    color: "#f1f1f1",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
    marginHorizontal: 4,
    lineHeight: 14,
  },
  shortViews: {
    color: "#aaa",
    fontSize: 10,
    marginTop: 2,
    marginHorizontal: 4,
    marginBottom: 6,
  },

  // Playlist Card
  playlistCard: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  playlistThumbnailContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
  },
  playlistThumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#282828",
    borderRadius: 8,
  },
  playlistOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "40%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  playlistCount: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },
  playlistTitle: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 8,
  },

  // About Section
  aboutContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutLabel: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "700",
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
    fontWeight: "600",
  },
});
