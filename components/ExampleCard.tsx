"use client"

import React from "react"
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"

interface ExampleCardProps {
  example: string
  onSwipeLeft: () => void
  onSwipeRight: () => void
  index: number
  totalCards: number
  gradientColors: string[]
}

export default function ExampleCard({
  example,
  onSwipeLeft,
  onSwipeRight,
  index,
  totalCards,
  gradientColors,
}: ExampleCardProps) {
  const pan = React.useRef(new Animated.ValueXY()).current
  const scale = React.useRef(new Animated.Value(1)).current

  // Calculate position based on index
  const positionY = 10 * index
  const positionX = 5 * index
  const zIndex = totalCards - index

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scale, {
          toValue: 0.98,
          friction: 7,
          useNativeDriver: true,
        }).start()
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }).start()

        if (gestureState.dx > 50) {
          Animated.timing(pan, {
            toValue: { x: 500, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 })
            onSwipeRight()
          })
        } else if (gestureState.dx < -50) {
          Animated.timing(pan, {
            toValue: { x: -500, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 })
            onSwipeLeft()
          })
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  const cardStyle = {
    transform: [{ translateX: pan.x }, { translateY: positionY }, { scale }, { translateX: positionX }],
    zIndex,
    opacity: index === 0 ? 1 : 1 - index * 0.15,
  }

  return (
    <Animated.View style={[styles.cardContainer, cardStyle]} {...(index === 0 ? panResponder.panHandlers : {})}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
        <BlurView intensity={15} tint="dark" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.exampleNumber}>Example {index + 1}</Text>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleText}>{example}</Text>
          </View>

          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>Swipe to see more examples</Text>
          </View>
        </BlurView>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 1,
  },
  card: {
    borderRadius: 19,
    padding: 16,
    height: 180,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  cardHeader: {
    marginBottom: 16,
  },
  exampleNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "SUBOLD",
  },
  exampleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  exampleText: {
    fontSize: 18,
    color: "white",
    lineHeight: 26,
    fontFamily: "SUB",
  },
  swipeHint: {
    alignItems: "center",
    marginTop: 16,
  },
  swipeHintText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
  },
})
