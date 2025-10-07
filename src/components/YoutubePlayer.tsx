import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface YouTubePlayerProps {
  videoId: string;
  height?: number;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export const YouTubePlayerComponent: React.FC<YouTubePlayerProps> = ({
  videoId,
  height = 220,
  onReady,
  onError,
}) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const onPlayerReady = useCallback(() => {
    setLoading(false);
    onReady?.();
  }, [onReady]);

  const handleError = useCallback(
    (error: string) => {
      setLoading(false);
      onError?.(error);
    },
    [onError]
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      )}
      <YoutubePlayer
        height={height}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        onReady={onPlayerReady}
        onError={handleError}
        webViewProps={{
          injectedJavaScript: `
            var element = document.getElementsByClassName('container')[0];
            element.style.position = 'unset';
            element.style.paddingBottom = 'unset';
            true;
          `,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    position: "relative",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "#000",
  },
});
