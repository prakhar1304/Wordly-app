"use client"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { ProgressChart } from "./ProgressChart"

const { width } = Dimensions.get("window")

interface StatsCardProps {
  totalWords: number
  wordsThisWeek: number
}

export default function StatsCard({ totalWords, wordsThisWeek }: StatsCardProps) {
  // Calculate progress percentage (for demo purposes)
  const weeklyGoal = 7 // words per week
  const weeklyProgress = Math.min(wordsThisWeek / weeklyGoal, 1)

  // Calculate streak (for demo purposes)
  const streak = 3

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={["#2A2D3E", "#5A189A", "#7B2CBF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Shine effect */}
        <View style={styles.shineEffect} />

        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Vocabulary Stats</Text>
            <Text style={styles.cardSubtitle}>Keep learning to grow your vocabulary!</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalWords}</Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>

          <View style={styles.chartContainer}>
            <ProgressChart progress={weeklyProgress} />
            <View style={styles.chartCenterText}>
              <Text style={styles.chartValue}>{wordsThisWeek}</Text>
              <Text style={styles.chartLabel}>This Week</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakValue}>{streak}</Text>
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.levelContainer}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Current Level</Text>
            <Text style={styles.levelValue}>Beginner</Text>
          </View>
          <View style={styles.levelProgressContainer}>
            <View style={styles.levelProgressBar}>
              <View style={[styles.levelProgressFill, { width: `${(totalWords / 50) * 100}%` }]} />
            </View>
            <Text style={styles.levelProgressText}>{50 - totalWords} words to next level</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: width - 32,
    borderRadius: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(165, 29, 29, 0.1)",
  },
  shineEffect: {
    position: "absolute",
    top: -150,
    left: -150,
    width: 300,
    height: 300,
    backgroundColor: "rgba(221, 185, 221, 0.12)",
    borderRadius: 150,
    transform: [{ rotate: "35deg" }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardTitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "SUB",
  },
  cardSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "SUB",
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Tittle-bold",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "SUB",
  },
  chartContainer: {
    width: 100,
    height: 100,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Tittle-bold",
  },
  chartLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    fontFamily: "SUB",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(224, 122, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(224, 122, 255, 0.3)",
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakValue: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  levelContainer: {
    marginTop: 10,
  },
  levelInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontFamily: "SUB",
  },
  levelValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SUB",
  },
  levelProgressContainer: {
    marginBottom: 10,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  levelProgressFill: {
    height: "100%",
    backgroundColor: "#e07aff",
    borderRadius: 4,
  },
  levelProgressText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "right",
    fontFamily: "SUB",
  },
})
