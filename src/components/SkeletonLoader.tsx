import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <View style={styles.videoCardContainer}>
      <SkeletonLoader height={200} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <SkeletonLoader width={36} height={36} borderRadius={18} />
        <View style={styles.textContainer}>
          <SkeletonLoader width="90%" height={16} style={styles.titleLine} />
          <SkeletonLoader width="70%" height={14} style={styles.metaLine} />
          <SkeletonLoader width="60%" height={14} />
        </View>
      </View>
    </View>
  );
};

export const ChannelSkeleton: React.FC = () => {
  return (
    <View style={styles.channelContainer}>
      <SkeletonLoader height={150} style={styles.banner} />
      <View style={styles.channelInfoContainer}>
        <SkeletonLoader
          width={80}
          height={80}
          borderRadius={40}
          style={styles.avatar}
        />
        <SkeletonLoader width="60%" height={20} style={styles.channelName} />
        <SkeletonLoader width="40%" height={14} style={styles.stats} />
        <SkeletonLoader width="80%" height={14} style={styles.description} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#272727",
  },
  videoCardContainer: {
    marginBottom: 12,
  },
  thumbnail: {
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleLine: {
    marginBottom: 8,
  },
  metaLine: {
    marginBottom: 4,
  },
  channelContainer: {
    marginBottom: 16,
  },
  banner: {
    marginBottom: 16,
  },
  channelInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  channelName: {
    marginBottom: 8,
  },
  stats: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
});
