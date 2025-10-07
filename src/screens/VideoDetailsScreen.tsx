/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fetchChannelDetails,
  fetchComments,
  fetchRelatedVideos,
  fetchVideoDetails,
} from "../api/api-client";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingScreen } from "../components/LoadingScreen";
import { YouTubePlayerComponent } from "../components/YoutubePlayer";
import { formatDate, formatNumber } from "../utils/format";

const { width } = Dimensions.get("window");

interface VideoDetails {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail: { url: string }[];
  viewCount: string;
  likeCount: string;
  publishDate: string;
  description: string;
  author: {
    channelId: string;
  };
  subscriberCountText: string;
  stats: {
    views: string;
    likes: string;
    comments: string;
  };
}

interface Comment {
  commentId: string;
  authorText: string;
  authorChannelId: string;
  authorThumbnail?: { url: string }[];
  textDisplay: string;
  publishedTimeText: string;
  likesCount: string;
}

const VideoDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoId, channelId } = route.params as {
    videoId: string;
    channelId: string;
  };
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [channelDetails, setChannelDetails] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<"related" | "comments">("related");
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    fetchData();
  }, [videoId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [detailsResult, relatedResult, commentsResult, channelResult] =
        await Promise.all([
          fetchVideoDetails(videoId),
          fetchRelatedVideos(videoId),
          fetchComments(videoId),
          fetchChannelDetails(channelId),
        ]);

      if (detailsResult.isError) {
        setError(detailsResult.error || "Failed to load video details");
      } else {
        setVideoDetails(detailsResult.data);
      }

      if (!relatedResult.isError) {
        setRelatedVideos(relatedResult.data || []);
      }

      if (!commentsResult.isError) {
        setComments(commentsResult.data || []);
      }

      if (!channelResult.isError) {
        setChannelDetails(channelResult.data);
      }
    } catch (_error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChannelPress = () => {
    if (videoDetails?.channelId) {
      navigation.navigate("Channel", { channelId: videoDetails?.channelId });
    }
    setShowFullDescription(false);
  };

  const handleRelatedVideoPress = (
    relatedVideoId: string,
    channelId: string
  ) => {
    setIsPlayerReady(false);
    setShowFullDescription(false);
    navigation.navigate("VideoDetails", {
      videoId: relatedVideoId,
      channelId: channelId,
    });
  };

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
  };

  const handlePlayerError = (error: string) => {
    Alert.alert("Player Error!", "Player is not ready, try again");
  };

  if (loading) {
    return <LoadingScreen message="Loading video..." />;
  }

  if (error || !videoDetails) {
    return (
      <ErrorMessage message={error || "Video not found"} onRetry={fetchData} />
    );
  }

  console.log(JSON.stringify(relatedVideos, null, 4));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <SafeAreaView edges={["top"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <MaterialIcons name="cast" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="more-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* YouTube Video Player */}
        <View style={styles.videoPlayer}>
          <YouTubePlayerComponent
            videoId={videoId}
            height={width * (9 / 16)}
            onReady={handlePlayerReady}
            onError={handlePlayerError}
          />
        </View>

        {/* Video Info */}
        <View style={styles.videoInfoSection}>
          <Text style={styles.videoTitle}>{videoDetails.title}</Text>
          <Text style={styles.videoStats}>
            {formatNumber(videoDetails?.viewCount)} views •{" "}
            {formatDate(videoDetails?.publishDate)}
          </Text>

          {/* Action Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.actionsContainer}
          >
            <TouchableOpacity style={styles.actionButton}>
              <AntDesign name="like" size={20} color="white" />
              <Text style={styles.actionText}>
                {formatNumber(videoDetails?.likeCount)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <AntDesign name="dislike" size={20} color="white" />
              <Text style={styles.actionText}>Dislike</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="share-2" size={20} color="white" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="download" size={20} color="white" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="playlist-add" size={20} color="white" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* Channel Info */}
        <TouchableOpacity
          style={styles.channelSection}
          onPress={handleChannelPress}
        >
          <Image
            source={{ uri: channelDetails?.meta?.avatar?.[1]?.url || "" }}
            style={styles.channelAvatar}
          />
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>
              {channelDetails?.meta?.title}
            </Text>
            <Text style={styles.subscriberCount}>
              {formatNumber(channelDetails?.meta?.subscriberCount) ||
                "Subscribe"}
            </Text>
          </View>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {videoDetails?.description}
          </Text>
          <TouchableOpacity
            onPress={() => setShowFullDescription(!showFullDescription)}
          >
            <Text style={styles.showMoreText}>
              {showFullDescription ? "Show less" : "Show more"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "related" && styles.tabActive]}
            onPress={() => setActiveTab("related")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "related" && styles.tabTextActive,
              ]}
            >
              Related
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "comments" && styles.tabActive]}
            onPress={() => setActiveTab("comments")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "comments" && styles.tabTextActive,
              ]}
            >
              Comments ({comments?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Related Videos */}
        {activeTab === "related" && (
          <View style={styles.relatedSection}>
            {relatedVideos?.length === 0 ? (
              <View style={styles.noContentContainer}>
                <Feather name="video" size={48} color="#666" />
                <Text style={styles.noContentText}>
                  No related videos available
                </Text>
              </View>
            ) : (
              relatedVideos
                ?.filter(
                  (v) => v.type !== "playlist" && v.type !== "shorts_listing"
                )
                ?.map((video, index) => (
                  <TouchableOpacity
                    key={`${video.videoId}-${index}`}
                    style={styles.relatedVideoCard}
                    onPress={() =>
                      handleRelatedVideoPress(video.videoId, video.channelId)
                    }
                  >
                    <View>
                      <Image
                        source={{ uri: video?.thumbnail?.[0]?.url || "" }}
                        style={styles.relatedThumbnail}
                      />
                      {video.lengthText ? (
                        <Text style={styles.lengthText}>
                          {video.lengthText}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.relatedVideoInfo}>
                      <Text style={styles.relatedVideoTitle} numberOfLines={2}>
                        {video.title}
                      </Text>

                      <View style={styles.relatedChannelRow}>
                        <Image
                          source={{
                            uri: video?.channelThumbnail?.[0]?.url || "",
                          }}
                          style={styles.channelRelatedAvatar}
                        />
                        <View style={styles.relatedMetaContainer}>
                          <Text style={styles.relatedVideoMeta}>
                            {video.channelTitle}
                          </Text>
                          <Text style={styles.relatedVideoMeta}>
                            {video.viewCountText} • {video.publishedTimeText}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}
          </View>
        )}

        {/* Comments */}
        {activeTab === "comments" && (
          <View style={styles.commentsSection}>
            {comments?.length === 0 ? (
              <View style={styles.noContentContainer}>
                <Feather name="message-circle" size={48} color="#666" />
                <Text style={styles.noContentText}>No comments available</Text>
              </View>
            ) : (
              comments?.map((comment) => (
                <View key={comment.commentId} style={styles.commentCard}>
                  <Image
                    source={{ uri: comment?.authorThumbnail?.[0]?.url || "" }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {comment?.authorText || "Unknown"}
                      </Text>
                      <Text style={styles.commentTime}>
                        {comment?.publishedTimeText}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>
                      {comment?.textDisplay}
                    </Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <AntDesign name="like" size={14} color="#aaa" />
                        <Text style={styles.commentActionText}>
                          {formatNumber(comment?.likesCount)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <AntDesign name="dislike" size={14} color="#aaa" />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.replyText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default VideoDetailsScreen;

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
  videoPlayer: {
    width: width,
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  videoInfoSection: {
    padding: 12,
  },
  videoTitle: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 8,
  },
  videoStats: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#272727",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  lengthText: {
    color: "white",
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#282828",
    borderRadius: 2,
    paddingHorizontal: 2,
    fontSize: 12,
  },
  actionText: {
    color: "#f1f1f1",
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#272727",
    marginVertical: 12,
  },
  channelSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#282828",
  },
  channelRelatedAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#282828",
  },
  channelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  channelName: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "600",
  },
  subscriberCount: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  subscribeButton: {
    backgroundColor: "#ff0000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  descriptionSection: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  description: {
    color: "#f1f1f1",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  showMoreText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "500",
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
  relatedSection: {
    padding: 12,
  },
  relatedVideoCard: {
    flexDirection: "row",
    marginBottom: 12,
  },
  relatedThumbnail: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "#282828",
  },
  relatedVideoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "flex-start",
  },
  relatedVideoTitle: {
    color: "#f1f1f1",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 4,
  },
  relatedChannelRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  relatedMetaContainer: {
    flex: 1,
  },
  relatedVideoMeta: {
    color: "#aaa",
    fontSize: 11,
    lineHeight: 16,
  },
  commentsSection: {
    padding: 12,
  },
  noContentContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noContentText: {
    color: "#666",
    fontSize: 14,
    marginTop: 12,
  },
  commentCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#282828",
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    color: "#f1f1f1",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  commentTime: {
    color: "#aaa",
    fontSize: 11,
  },
  commentText: {
    color: "#f1f1f1",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    color: "#aaa",
    fontSize: 11,
  },
  replyText: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "500",
  },
});
