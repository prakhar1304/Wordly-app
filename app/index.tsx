"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import WordCard from "../components/WordCard"
import ExampleCard from "../components/ExampleCard"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")

// Define interfaces for the word data
interface WordData {
  word: string
  meaning: string
  partOfSpeech: string
  difficulty?: string
  examples: string[]
}

// Initial default word
const initialWord: WordData = {
  word: "Loading...",
  meaning: "Please wait while we fetch your word of the day.",
  partOfSpeech: "noun",
  examples: [
    "Please wait while we fetch examples.",
    "Examples will appear here shortly.",
    "Swipe to see more examples once loaded."
  ]
}

// Storage key for saved words
const STORAGE_KEY = "@wordly_saved_words"
const STREAK_KEY = "@wordly_streak"
const LAST_SEEN_KEY = "@wordly_last_seen"

export default function HomeScreen() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [streakDays, setStreakDays] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const [currentWord, setCurrentWord] = useState<WordData>(initialWord)
  const [isLoading, setIsLoading] = useState(true)
  const [savedWords, setSavedWords] = useState<WordData[]>([])

  useEffect(() => {
    // Load saved words and check streak on component mount
    loadSavedWordsAndCheckStreak()
    // Fetch a new word
    fetchNewWord()
  }, [])

  useEffect(() => {
    // Auto-hide the streak modal after 5 seconds
    if (showStreakModal) {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowStreakModal(false)
        })
      }, 5000)

      // Show the modal with animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()

      return () => clearTimeout(timer)
    }
  }, [showStreakModal, fadeAnim, scaleAnim])

  const loadSavedWordsAndCheckStreak = async () => {
    try {
      // Load saved words
      const savedWordsJson = await AsyncStorage.getItem(STORAGE_KEY)
      const words = savedWordsJson ? JSON.parse(savedWordsJson) : []
      setSavedWords(words)

      // Check last seen date for streak calculation
      const lastSeenDate = await AsyncStorage.getItem(LAST_SEEN_KEY)
      const currentDate = new Date().toDateString()
      
      if (lastSeenDate) {
        const lastDate = new Date(lastSeenDate)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        // Update streak based on last seen
        if (diffDays === 1) {
          // Consecutive day, increase streak
          const currentStreak = await AsyncStorage.getItem(STREAK_KEY)
          const newStreak = currentStreak ? parseInt(currentStreak) + 1 : 1
          await AsyncStorage.setItem(STREAK_KEY, newStreak.toString())
          setStreakDays(newStreak)
          
          // Show streak modal if streak is at least 2 days
          if (newStreak >= 2) {
            setShowStreakModal(true)
          }
        } else if (diffDays > 1) {
          // Streak broken, reset to 1
          await AsyncStorage.setItem(STREAK_KEY, "1")
          setStreakDays(1)
        } else {
          // Same day, maintain current streak
          const currentStreak = await AsyncStorage.getItem(STREAK_KEY) || "0"
          setStreakDays(parseInt(currentStreak))
        }
      } else {
        // First time user
        await AsyncStorage.setItem(STREAK_KEY, "1")
        setStreakDays(1)
      }
      
      // Update last seen date
      await AsyncStorage.setItem(LAST_SEEN_KEY, currentDate)
      
    } catch (error) {
      console.error("Error loading saved words:", error)
    }
  }

  const handleSwipeLeft = () => {
    if (currentCardIndex < currentWord.examples.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handleSwipeRight = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const saveWordToStorage = async (word: WordData) => {
    try {
      // Add the new word to the saved words array
      const updatedWords = [...savedWords, word]
      setSavedWords(updatedWords)
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords))
    } catch (error) {
      console.error("Error saving word:", error)
    }
  }

  const fetchNewWord = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://wordoftheday-aco3.onrender.com/api/v1/vocab-word")
      
      if (!response.ok) {
        throw new Error("Failed to fetch new word")
      }
      
      const data = await response.json()
      
      // Format the data to match our WordData interface
      const newWord: WordData = {
        word: data.word,
        meaning: data.meaning,
        partOfSpeech: data.type,
        difficulty: data.difficulty,
        examples: data.examples || []
      }
      
      // Update state
      setCurrentWord(newWord)
      setCurrentCardIndex(0)
      
      // Save the word to AsyncStorage
      await saveWordToStorage(newWord)
      
    } catch (error) {
      console.error("Error fetching new word:", error)
      Alert.alert(
        "Error",
        "Failed to fetch a new word. Please check your connection and try again.",
        [{ text: "OK" }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToHistory = () => {
    // This function would navigate to a history screen
    // For now, we'll just log the saved words
    console.log("Saved words:", savedWords)
    Alert.alert(
      "Word History",
      `You have learned ${savedWords.length} words so far!`,
      [{ text: "OK" }]
    )
  }

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dwbdtvo3s/image/upload/v1745057357/xwori62wi2y0lfcyanop.jpg",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* App Header */}
        <BlurView intensity={20} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { fontFamily: "Title-light" }]}>WORDLY</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.streakContainer}>
                <LinearGradient
                  colors={["#e07aff", "#9D4EDD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.streakBadge}
                >
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <Text style={styles.streakCount}>{streakDays}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.wordCardContainer}>
            <WordCard 
              word={{
                word: currentWord.word,
                meaning: currentWord.meaning,
                partOfSpeech: currentWord.partOfSpeech,
                difficulty: currentWord.difficulty
              }} 
              onFetchNewWord={fetchNewWord}
              isLoading={isLoading}
            />
          </View>

          <View style={styles.examplesSection}>
            <Text style={styles.sectionTitle}>Example Sentences</Text>
            <Text style={styles.sectionSubtitle}>Swipe to see how to use this word in real life</Text>

            <View style={styles.cardsContainer}>
              {currentWord.examples.map((example, index) => {
                // Only render cards that are the current one or the next few
                if (index < currentCardIndex || index > currentCardIndex + 2) return null

                // Calculate different shades for each card
                const gradientColors = 
                  index === 0
                    ? ["#9D4EDD", "#7B2CBF", "#5A189A"]
                    : index === 1
                      ? ["#7B2CBF", "#5A189A", "#3C096C"]
                      : ["#5A189A", "#3C096C", "#240046"]

                return (
                  <ExampleCard
                    key={index}
                    example={example}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    index={index - currentCardIndex}
                    totalCards={Math.min(3, currentWord.examples.length - currentCardIndex)}
                    gradientColors={gradientColors}
                  />
                )
              })}
            </View>

            <View style={styles.cardIndicators}>
              {currentWord.examples.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: index === currentCardIndex ? "#9D4EDD" : "rgba(255, 255, 255, 0.2)",
                      width: index === currentCardIndex ? 20 : 8,
                    },
                  ]}
                />
              ))}
            </View>

            <BlurView intensity={20} tint="dark" style={styles.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="rgba(255, 255, 255, 0.8)"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Tap the speaker icon to hear the pronunciation. Tap "New Word" to get a different word.
              </Text>
            </BlurView>
          </View>
        </ScrollView>

        {/* <TouchableOpacity style={styles.historyButton} onPress={navigateToHistory}>
          <LinearGradient
            colors={["#9D4EDD", "#7B2CBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.historyButtonGradient}
          >
            <Ionicons name="time-outline" size={20} color="#fff" style={styles.historyIcon} />
            <Text style={styles.historyButtonText}>View History</Text>
          </LinearGradient>
        </TouchableOpacity> */}

        {/* Streak Celebration Modal */}
        <Modal visible={showStreakModal} transparent animationType="none">
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#e07aff", "#9D4EDD", "#7B2CBF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalGradient}
              >
                <View style={styles.fireContainer}>
                  <Text style={styles.fireEmoji}>🔥</Text>
                  <Text style={styles.streakNumber}>{streakDays}</Text>
                </View>
                <Text style={styles.modalTitle}>Amazing Streak!</Text>
                <Text style={styles.modalText}>
                  You've learned a new word for {streakDays} days in a row! Keep it up to expand your vocabulary.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    Animated.parallel([
                      Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                      Animated.timing(scaleAnim, {
                        toValue: 0.9,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                    ]).start(() => {
                      setShowStreakModal(false)
                    })
                  }}
                >
                  <Text style={styles.modalButtonText}>Continue</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(18, 18, 24, 0.85)",
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for the history button
  },
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(152, 128, 171, 0.3)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "Title-light",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakContainer: {
    marginRight: 16,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakCount: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e07aff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(18, 18, 24, 0.85)",
  },
  notificationCount: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  wordCardContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  examplesSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 6,
    color: "#fff",
    fontFamily: "SUB",
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "SUB",
  },
  cardsContainer: {
    height: 220,
    position: "relative",
    marginBottom: 60,
  },
  cardIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.3)",
    overflow: "hidden",
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    color: "rgba(255, 255, 255, 0.8)",
  },
  historyButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  historyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  historyIcon: {
    marginRight: 8,
  },
  historyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 24,
    alignItems: "center",
  },
  fireContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  fireEmoji: {
    fontSize: 36,
  },
  streakNumber: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#e07aff",
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: "center",
    lineHeight: 30,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "white",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})