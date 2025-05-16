
"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as Speech from "expo-speech"

const { width } = Dimensions.get("window")

interface WordData {
  word: string
  meaning: string
  partOfSpeech: string
  difficulty?: string
}

interface WordCardProps {
  word: WordData
  onFetchNewWord: () => void
  isLoading?: boolean
}

export default function WordCard({ word, onFetchNewWord, isLoading = false }: WordCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speakWord = () => {
    setIsSpeaking(true)
    Speech.speak(word.word, {
      language: "en",
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    })
  }

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

        <View style={styles.wordHeader}>
          <Text style={styles.wordLabel}>Word of the Day</Text>
          <TouchableOpacity
            style={[styles.speakerButton, isSpeaking && styles.speaking]}
            onPress={speakWord}
            activeOpacity={0.7}
            disabled={isSpeaking || isLoading}
          >
            <Ionicons name={isSpeaking ? "volume-high" : "volume-medium"} size={20} color="white" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e07aff" />
            <Text style={styles.loadingText}>Loading new word...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.wordValue}>{word.word}</Text>
            <Text style={styles.partOfSpeech}>{word.partOfSpeech}</Text>
            
            {word.difficulty && (
              <View style={[styles.difficultyBadge, 
                word.difficulty === "easy" ? styles.easyBadge : 
                word.difficulty === "medium" ? styles.mediumBadge : 
                styles.hardBadge
              ]}>
                <Text style={styles.difficultyText}>{word.difficulty}</Text>
              </View>
            )}

            <View style={styles.meaningContainer}>
              <Text style={styles.meaningLabel}>Meaning</Text>
              <Text style={styles.meaningValue}>{word.meaning}</Text>
            </View>
          </>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.newWordButton, isLoading && styles.disabledButton]} 
            onPress={onFetchNewWord} 
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Ionicons name="refresh-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>New Word</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: width - 32,
    height: 290,
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
    height: "100%",
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
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "SUB",
  },
  speakerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  speaking: {
    backgroundColor: "rgba(224, 122, 255, 0.3)",
  },
  wordValue: {
    color: "white",
    fontSize: 29,
    marginTop: 12,
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "Tittle-bold",
  },
  partOfSpeech: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 4,
  },
  difficultyBadge: {
    position: "absolute",
    top: 20,
    right: 70,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  easyBadge: {
    backgroundColor: "rgba(39, 174, 96, 0.3)",
  },
  mediumBadge: {
    backgroundColor: "rgba(243, 156, 18, 0.3)",
  },
  hardBadge: {
    backgroundColor: "rgba(231, 76, 60, 0.3)",
  },
  difficultyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  meaningContainer: {
    marginTop: 16,
  },
  meaningLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 4,
  },
  meaningValue: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
  actionButtonsContainer: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  newWordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(224, 122, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(224, 122, 255, 0.3)",
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
})