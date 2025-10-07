import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatViewCount } from "../utils/format";

interface VideoCardProps {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  viewCount: string;
  publishedTimeText: string;
  thumbnail: string;
  channelThumbnail: string;
  lengthText: string;
  onPress: () => void;
  onChannelPress: () => void;
  onMorePress?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  title,
  channelTitle,
  viewCount,
  publishedTimeText,
  thumbnail,
  channelThumbnail,
  onPress,
  onChannelPress,
  onMorePress,
  lengthText,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View>
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <Text style={styles.lengthText}>{lengthText}</Text>
      </View>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={onChannelPress}>
          <Image
            source={{ uri: channelThumbnail }}
            style={styles.channelAvatar}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.meta}>{channelTitle}</Text>
          <Text style={styles.meta}>
            {formatViewCount(viewCount)} • {publishedTimeText}
          </Text>
        </View>
        {onMorePress && (
          <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
            <Feather name="more-vertical" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: "#0f0f0f",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#282828",
  },
  lengthText: {
    color: "white",
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#282828",
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 12,
  },
  channelAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#282828",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 4,
  },
  meta: {
    color: "#aaaaaa",
    fontSize: 12,
    lineHeight: 16,
  },
  moreButton: {
    padding: 4,
  },
});
