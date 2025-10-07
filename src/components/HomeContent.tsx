import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HomeContentProps {
  section: any;
}

const HomeContent: React.FC<HomeContentProps> = ({ section }) => {
  // Don't render if section is missing
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

  // Render Video Item (for video_listing sections)
  const renderVideoItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.videoCard} activeOpacity={0.8}>
        <Image
          source={{
            uri:
              item.thumbnail?.[item.thumbnail.length - 1]?.url ||
              item.thumbnail?.[0]?.url,
          }}
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
        {item.lengthText && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.lengthText}</Text>
          </View>
        )}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.videoMeta} numberOfLines={1}>
            {item.viewCount} views • {item.publishedTimeText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render Shorts Item (for shorts_listing sections)
  const renderShortsItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.shortsCard}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.thumbnail?.[0]?.url }}
          style={styles.shortsThumbnail}
          resizeMode="cover"
        />
        <View style={styles.shortsOverlay}>
          <MaterialIcons name="play-arrow" size={40} color="#fff" />
        </View>
        <View style={styles.shortsInfo}>
          <Text style={styles.shortsTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.shortsViews}>{item.viewCountText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render Channel Item (for channel_listing sections)
  const renderChannelItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.channelCard}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.thumbnail?.[1]?.url || item.thumbnail?.[0]?.url }}
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
          <Text style={styles.channelVideos} numberOfLines={1}>
            {item.videoCount} videos
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render Post Item (for post_listing sections)
  const renderPostItem = (item: any, index: number) => {
    return (
      <View key={index} style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: item.authorThumbnail?.[0]?.url }}
            style={styles.postAvatar}
          />
          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthor}>{item.authorText}</Text>
            <Text style={styles.postTime}>{item.publishedTimeText}</Text>
          </View>
        </View>
        <Text style={styles.postContent} numberOfLines={6}>
          {item.contentText}
        </Text>
        {item.attachment?.type === "image" && item.attachment.image && (
          <Image
            source={{
              uri:
                item.attachment.image[2]?.url || item.attachment.image[0]?.url,
            }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        {item.attachment?.type === "poll" && (
          <View style={styles.pollContainer}>
            {item.attachment.choices?.map((choice: string, idx: number) => (
              <TouchableOpacity key={idx} style={styles.pollOption}>
                <Text style={styles.pollOptionText} numberOfLines={2}>
                  {choice}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.pollVotes}>{item.attachment.totalVotes}</Text>
          </View>
        )}
        <View style={styles.postFooter}>
          <View style={styles.postStats}>
            <MaterialIcons name="thumb-up" size={16} color="#666" />
            <Text style={styles.postStatText}>{item.voteCountText}</Text>
          </View>
          <View style={styles.postStats}>
            <MaterialIcons name="comment" size={16} color="#666" />
            <Text style={styles.postStatText}>{item.replyCount} replies</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render Player Section (single featured video)
  if (section.type === "player") {
    return (
      <View style={styles.playerContainer}>
        <TouchableOpacity style={styles.playerCard} activeOpacity={0.8}>
          <Image
            source={{
              uri: `https://i.ytimg.com/vi/${section.videoId}/maxresdefault.jpg`,
            }}
            style={styles.playerThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playerOverlay}>
            <MaterialIcons name="play-circle-filled" size={64} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.playerInfo}>
          <Text style={styles.playerTitle} numberOfLines={2}>
            {section.title}
          </Text>
          <Text style={styles.playerMeta}>
            {section.viewCount} views • {section.publishedTimeText}
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

  // Render Video Listing (vertical list of videos)
  if (section.type === "video_listing") {
    // Don't render if no data
    if (!section.data || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        {section.data.map((item: any, index: number) => (
          <View key={index}>{renderVideoItem({ item })}</View>
        ))}
      </View>
    );
  }

  // Render Shorts Listing (horizontal scrollable shorts)
  if (section.type === "shorts_listing") {
    if (!section.data || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {section.data.map((item: any, index: number) =>
            renderShortsItem(item, index)
          )}
        </ScrollView>
      </View>
    );
  }

  // Render Channel Listing (horizontal scrollable channels)
  if (section.type === "channel_listing") {
    if (!section.data || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {section.data.map((item: any, index: number) =>
            renderChannelItem(item, index)
          )}
        </ScrollView>
      </View>
    );
  }

  // Render Post Listing (vertical scrollable posts)
  if (section.type === "post_listing") {
    if (!section.data || section.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.listingContainer}>
        {renderSectionHeader()}
        {section.data.map((item: any, index: number) =>
          renderPostItem(item, index)
        )}
      </View>
    );
  }

  // Unknown section type - don't render
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

  // Player Section (Featured Video)
  playerContainer: {
    marginBottom: 24,
  },
  playerCard: {
    backgroundColor: "#000",
    position: "relative",
  },
  playerThumbnail: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  playerMeta: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 8,
  },
  playerDescription: {
    fontSize: 13,
    color: "#ccc",
    lineHeight: 18,
  },

  // Video Card
  videoCard: {
    backgroundColor: "#0f0f0f",
    marginBottom: 16,
  },
  videoThumbnail: {
    width: "100%",
    height: 210,
    backgroundColor: "#000",
  },
  durationBadge: {
    position: "absolute",
    top: 180,
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
    padding: 12,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
    lineHeight: 20,
  },
  videoMeta: {
    fontSize: 13,
    color: "#aaa",
  },

  // Shorts Card
  shortsCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    overflow: "hidden",
  },
  shortsThumbnail: {
    width: 150,
    height: 265,
    backgroundColor: "#000",
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
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
    lineHeight: 17,
  },
  shortsViews: {
    fontSize: 12,
    color: "#aaa",
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
    backgroundColor: "#000",
    marginBottom: 12,
  },
  channelInfo: {
    alignItems: "center",
    width: "100%",
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  channelMeta: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 2,
  },
  channelVideos: {
    fontSize: 12,
    color: "#aaa",
  },

  // Post Card
  postCard: {
    backgroundColor: "#0f0f0f",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 0,
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
    backgroundColor: "#000",
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: "#aaa",
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
    backgroundColor: "#000",
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
  },
  pollVotes: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
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
