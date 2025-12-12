import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar, Dimensions } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus, Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "expo-asset";
import ChevronIcon from "@assets/svg/icon/chevron";

interface CoherenceCardiaqueVideoScreenProps {
  navigation: any;
}

const CoherenceCardiaqueVideoScreen: React.FC<CoherenceCardiaqueVideoScreenProps> = ({ navigation }) => {
  const video = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          // Android
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        const asset = Asset.fromModule(require("../../../assets/videos/sante-mentale-exercice-coherence-cardiaque.mp4"));
        await asset.downloadAsync();
        setVideoUri(asset.localUri || asset.uri);
      } catch (err) {
        console.error("Error loading video:", err);
        setError("Impossible de charger la vidéo");
        setIsLoading(false);
      }
    }
    loadVideo();
  }, []);

  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);

    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        setError(`Erreur de lecture: ${playbackStatus.error}`);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronIcon color="white" />
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Exercice de cohérence cardiaque</Text>
        </View>
      </SafeAreaView>

      <View style={styles.videoContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Chargement de la vidéo...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => {
                setError(null);
                setIsLoading(true);
                video.current?.playFromPositionAsync(0);
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {videoUri && (
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: videoUri }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            shouldPlay={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "column",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    padding: 20,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1E88E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CoherenceCardiaqueVideoScreen;
