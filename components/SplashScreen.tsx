"use client"

import { useEffect, useRef } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  StatusBar,
  ImageBackground 
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function SplashScreen() {
  const insets = useSafeAreaInsets()
  
  // Animation values
  const zoomAnim = useRef(new Animated.Value(0.6)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const shineAnim = useRef(new Animated.Value(-width)).current
  
  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in and zoom in the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(zoomAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Shine effect across the logo
      Animated.timing(shineAnim, {
        toValue: width * 1.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      
      // Small delay before navigating away
      Animated.delay(500),
    ]).start(() => {
      // Navigate to main app after animation completes
      router.replace("/(tabs)/")
    })
  }, [fadeAnim, zoomAnim, shineAnim])

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dwbdtvo3s/image/upload/v1745057357/xwori62wi2y0lfcyanop.jpg",
      }}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" />
      <View style={[
        styles.container, 
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}>
        <View style={styles.contentContainer}>
          {/* Main animated logo container */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: zoomAnim }],
              },
            ]}
          >
            {/* Shine effect overlay */}
            <Animated.View
              style={[
                styles.shineEffect,
                {
                  transform: [{ translateX: shineAnim }],
                },
              ]}
            />
            
            {/* Purple gradient background for the logo */}
            <LinearGradient
              colors={["#9D4EDD", "#7B2CBF", "#5A189A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              {/* Main app title */}
              <Text style={styles.logoText}>WORDLY</Text>
              
              {/* Tagline below logo */}
              <Text style={styles.tagline}>Expand your vocabulary daily</Text>
            </LinearGradient>
          </Animated.View>
          
          {/* Purple accent at bottom of screen */}
          <View style={styles.bottomAccent}>
            <LinearGradient
              colors={["transparent", "rgba(157, 78, 221, 0.3)"]}
              style={styles.bottomGradient}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(18, 18, 24, 0.85)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: width * 0.8,
    aspectRatio: 2 / 1,
    borderRadius: 24,
    overflow: "hidden", // Important for the shine effect
    elevation: 20,
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    position: "relative",
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  logoText: {
    fontFamily: "Title-light",
    fontSize: 48,
    color: "#fff",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 12,
  },
  tagline: {
    fontFamily: "SUB",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  shineEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.3,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    transform: [{ skewX: "-25deg" }],
    zIndex: 10,
  },
  bottomAccent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 200,
  },
  bottomGradient: {
    width: "100%",
    height: "100%",
  },
});