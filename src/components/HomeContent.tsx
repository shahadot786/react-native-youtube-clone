import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatNumber } from "../utils/format";

interface HomeSection {
  type: string;
  title?: string;
  subtitle?: string;
  data?: any[];
  videoId?: string;
  viewCount?: number | string;
  publishedTimeText?: string;
  description?: string;
}

interface HomeContentProps {
  section: HomeSection;
  channelId: string;
}

const HomeContent: React.FC<HomeContentProps> = ({ section, channelId }) => {
  const navigation = useNavigation();
  if (!section || !section.type) {
    return null;
  }

  const renderSectionHeader = () => {
    if (!section.title) return null;

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.subtitle && (
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
        )}
      </View>
    );
  };

  // Video Item Renderer
  const renderVideoItem = (item: any, index: number) => {
    if (!item || !item.videoId) return null;

    const thumbnailUrl =
      item.thumbnail?.[item.thumbnail.length - 1]?.url ||
      item.thumbnail?.[0]?.url;
    const videoId = item.videoId;

    return (
      <TouchableOpacity
        key={`video-${videoId}-${index}`}
        style={styles.videoCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("VideoDetails", { videoId, channelId })
        }
      >
        <View>
          <Image
            source={{ uri: thumbnailUrl || "" }}
            style={styles.videoThumbnailContainer}
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
            {item.title.slice(0, 30) + "..."}
          </Text>
          <Text style={styles.videoMeta} numberOfLines={1}>
            {item.viewCount
              ? `${formatNumber(item.viewCount)} views`
              : "No views"}{" "}
            • {item.publishedTimeText || "Recently"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Shorts Item Renderer
  const renderShortsItem = (item: any, index: number) => {
    if (!item || !item.videoId) return null;

    const thumbnailUrl = item.thumbnail?.[0]?.url;
    const videoId = item.videoId;
    return (
      <TouchableOpacity
        key={`short-${videoId}-${index}`}
        style={styles.shortsCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("VideoDetails", { videoId, channelId })
        }
      >
        <View style={styles.shortsThumbnailContainer}>
          <Image
            source={{ uri: thumbnailUrl || "" }}
            style={styles.shortsThumbnail}
            resizeMode="cover"
          />
          <View style={styles.shortsOverlay}>
            <MaterialIcons name="play-arrow" size={40} color="#fff" />
          </View>
        </View>
        <View style={styles.shortsInfo}>
          <Text style={styles.shortsTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.viewCountText && (
            <Text style={styles.shortsViews}>{item.viewCountText}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Channel Item Renderer
  const renderChannelItem = (item: any, index: number) => {
    if (!item || !item.title) return null;

    const avatarUrl = item.thumbnail?.[0]?.url;
    const channelId = item.channelId;

    return (
      <TouchableOpacity
        key={`channel-${item.channelId || index}`}
        style={styles.channelCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Channel", { channelId: channelId })}
      >
        <Image
          source={{ uri: `https:${avatarUrl}` || "" }}
          style={styles.channelAvatar}
          resizeMode="cover"
        />
        <View style={styles.channelInfo}>
          <Text style={styles.channelTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.channelMeta} numberOfLines={1}>
            {item.subscriberCount}
          </Text>
          {item.videoCount && (
            <Text style={styles.channelVideos} numberOfLines={1}>
              {item.videoCount} videos
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Post Item Renderer
  const renderPostItem = (item: any, index: number) => {
    if (!item || !item.contentText) return null;

    const authorAvatarUrl = item.authorThumbnail?.[0]?.url;
    const cleanUrl = item.attachment.image?.[0]?.url.split("=")[0];
    return (
      <View key={`post-${index}`} style={styles.postCard}>
        <View style={styles.postHeader}>
          {authorAvatarUrl && (
            <Image
              source={{ uri: `https:${authorAvatarUrl}` }}
              style={styles.postAvatar}
              resizeMode="cover"
            />
          )}
          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthor} numberOfLines={1}>
              {item.authorText}
            </Text>
            <Text style={styles.postTime}>
              {item.publishedTimeText || "Recently"}
            </Text>
          </View>
        </View>

        <Text style={styles.postContent} numberOfLines={6}>
          {item.contentText}
        </Text>

        {item.attachment?.type === "image" &&
          item.attachment?.image?.length > 0 && (
            <Image
              source={{
                uri: cleanUrl || "",
              }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}

        {item.attachment?.type === "poll" && item.attachment?.choices && (
          <View style={styles.pollContainer}>
            {item.attachment.choices.map((choice: string, idx: number) => (
              <TouchableOpacity key={`poll-${idx}`} style={styles.pollOption}>
                <Text style={styles.pollOptionText} numberOfLines={2}>
                  {choice}
                </Text>
              </TouchableOpacity>
            ))}
            {item.attachment.totalVotes && (
              <Text style={styles.pollVotes}>{item.attachment.totalVotes}</Text>
            )}
          </View>
        )}

        <View style={styles.postFooter}>
          {item.voteCountText && (
            <View style={styles.postStats}>
              <MaterialIcons name="thumb-up" size={16} color="#666" />
              <Text style={styles.postStatText}>{item.voteCountText}</Text>
            </View>
          )}
          {item.replyCount !== undefined && (
            <View style={styles.postStats}>
              <MaterialIcons name="comment" size={16} color="#666" />
              <Text style={styles.postStatText}>{item.replyCount} replies</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Player Section (Featured Video)
  if (section.type === "player") {
    if (!section.videoId) return null;
    const videoId = section.videoId;

    return (
      <View style={styles.playerContainer}>
        <TouchableOpacity
          style={styles.playerCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("VideoDetails", { videoId, channelId })
          }
        >
          <Image
            source={{
              uri: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            }}
            style={styles.playerThumbnail}
            resizeMode="cover"
          />
          {/* <View style={styles.playerOverlay}>
            <MaterialIcons name="play-circle-filled" size={64} color="#fff" />
          </View> */}
        </TouchableOpacity>
        <View style={styles.playerInfo}>
          <Text style={styles.playerTitle} numberOfLines={2}>
            {section.title}
          </Text>
          <Text style={styles.playerMeta}>
            {formatNumber(section.viewCount as number) || "0"} views •{" "}
            {section.publishedTimeText}
          </Text>
          {section.description && (
            <Text style={styles.playerDescription} numberOfLines={3}>
              {section.description}
            </Text>
          )}
        </View>
      </View>
    );
  }

  // Video Listing (Vertical List)
  if (section.type === "video_listing") {
    if (!Array.isArray(section.data) || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        {section.data.map((item, index) => renderVideoItem(item, index))}
      </View>
    );
  }

  // Shorts Listing (Horizontal Scrollable)
  if (section.type === "shorts_listing") {
    if (!Array.isArray(section.data) || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          scrollEventThrottle={16}
        >
          {section.data.map((item, index) => renderShortsItem(item, index))}
        </ScrollView>
      </View>
    );
  }

  // Channel Listing (Horizontal Scrollable)
  if (section.type === "channel_listing") {
    if (!Array.isArray(section.data) || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          scrollEventThrottle={16}
        >
          {section.data.map((item, index) => renderChannelItem(item, index))}
        </ScrollView>
      </View>
    );
  }

  // Post Listing (Vertical List)
  if (section.type === "post_listing") {
    if (!Array.isArray(section.data) || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        {section.data.map((item, index) => renderPostItem(item, index))}
      </View>
    );
  }

  // Unknown section type
  return null;
};

export default HomeContent;

const styles = StyleSheet.create({
  // Section Header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#aaa",
  },

  // Player Section
  playerContainer: {
    // marginBottom: 15,
    backgroundColor: "#0f0f0f",
  },
  playerCard: {
    position: "relative",
    backgroundColor: "#000",
  },
  playerThumbnail: {
    width: "100%",
    height: 180,
    backgroundColor: "#282828",
  },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playerInfo: {
    padding: 16,
    backgroundColor: "#0f0f0f",
  },
  playerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    lineHeight: 18,
  },
  playerMeta: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 4,
    fontWeight: "500",
  },
  playerDescription: {
    fontSize: 11,
    color: "#ccc",
    lineHeight: 14,
  },

  // Video Card
  videoCard: {
    flexDirection: "row",
    marginBottom: 12,
  },
  videoThumbnailContainer: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  videoThumbnail: {
    width: "100%",
    height: 210,
    backgroundColor: "#282828",
    borderRadius: 8,
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
    lineHeight: 16,
  },

  // Shorts Card
  shortsCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    overflow: "hidden",
  },
  shortsThumbnailContainer: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
  },
  shortsThumbnail: {
    width: 150,
    height: 265,
    backgroundColor: "#282828",
    borderRadius: 12,
  },
  shortsOverlay: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  shortsInfo: {
    padding: 10,
  },
  shortsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    lineHeight: 17,
  },
  shortsViews: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "500",
  },

  // Channel Card
  channelCard: {
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    marginRight: 16,
    padding: 16,
    borderRadius: 12,
    width: 160,
  },
  channelAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#282828",
    marginBottom: 12,
  },
  channelInfo: {
    alignItems: "center",
    width: "100%",
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  channelMeta: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 2,
    fontWeight: "500",
  },
  channelVideos: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "500",
  },

  // Post Card
  postCard: {
    backgroundColor: "#0f0f0f",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#282828",
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "500",
  },
  postContent: {
    fontSize: 14,
    color: "#ddd",
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 280,
    borderRadius: 8,
    backgroundColor: "#282828",
    marginBottom: 12,
  },
  pollContainer: {
    marginBottom: 12,
  },
  pollOption: {
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  pollOptionText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  pollVotes: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
    fontWeight: "500",
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1f1f1f",
    paddingTop: 12,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  postStatText: {
    fontSize: 13,
    color: "#aaa",
    marginLeft: 6,
    fontWeight: "500",
  },

  // Listing Containers
  listingContainer: {
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
