"use client"

import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Alert,
  ScrollView,
  Dimensions
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import AsyncStorage from "@react-native-async-storage/async-storage"
import StatsCard from "../components/StatsCard"

const { width } = Dimensions.get("window")

// Define interfaces for the word data
interface WordData {
  word: string
  meaning: string
  partOfSpeech: string
  difficulty?: string
  examples: string[]
  date?: string
  isFavorite?: boolean
}

// Storage key for saved words
const STORAGE_KEY = "@wordly_saved_words"

export default function HistoryScreen({ navigation }: { navigation: any }) {
  const [savedWords, setSavedWords] = useState<WordData[]>([])
  const [filteredWords, setFilteredWords] = useState<WordData[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
  const [totalWords, setTotalWords] = useState(0)
  const [wordsThisWeek, setWordsThisWeek] = useState(0)

  useEffect(() => {
    // Load saved words on component mount
    loadSavedWords()
  }, [])

  // Filter words when activeFilter changes
  useEffect(() => {
    filterWords(activeFilter)
  }, [activeFilter, savedWords])

  const loadSavedWords = async () => {
    try {
      const savedWordsJson = await AsyncStorage.getItem(STORAGE_KEY)
      const words = savedWordsJson ? JSON.parse(savedWordsJson) : []
      
      // Add dates if they don't exist (for demo purposes)
      const wordsWithDates = words.map((word: WordData, index: number) => {
        if (!word.date) {
          const date = new Date()
          date.setDate(date.getDate() - index)
          return {
            ...word,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }
        }
        return word
      })
      
      setSavedWords(wordsWithDates)
      setFilteredWords(wordsWithDates)
      setTotalWords(wordsWithDates.length)
      
      // Calculate words learned this week
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const recentWords = wordsWithDates.filter((word: WordData) => {
        if (!word.date) return false
        const wordDate = new Date(word.date)
        return wordDate >= oneWeekAgo
      })
      setWordsThisWeek(recentWords.length)
    } catch (error) {
      console.error("Error loading saved words:", error)
      Alert.alert(
        "Error",
        "Failed to load your word history. Please try again.",
        [{ text: "OK" }]
      )
    }
  }

  const filterWords = (filter: string) => {
    if (filter === "all") {
      setFilteredWords(savedWords)
    } else if (filter === "favorites") {
      const filtered = savedWords.filter(word => word.isFavorite)
      setFilteredWords(filtered)
    } else {
      const filtered = savedWords.filter(word => word.difficulty === filter)
      setFilteredWords(filtered)
    }
  }

  const handleClearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your entire word history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY)
              setSavedWords([])
              setFilteredWords([])
              setTotalWords(0)
              setWordsThisWeek(0)
              Alert.alert("Success", "Your word history has been cleared.")
            } catch (error) {
              console.error("Error clearing history:", error)
              Alert.alert("Error", "Failed to clear history. Please try again.")
            }
          }
        }
      ]
    )
  }

  const handleExportHistory = () => {
    // This would handle exporting functionality
    Alert.alert(
      "Export Words",
      "This feature will allow you to export your saved words to a file. Coming soon!",
      [{ text: "OK" }]
    )
  }

  const toggleWordExpansion = (word: string) => {
    if (expandedWord === word) {
      setExpandedWord(null)
    } else {
      setExpandedWord(word)
    }
  }

  const toggleFavorite = async (wordToToggle: WordData) => {
    try {
      const updatedWords = savedWords.map(word => {
        if (word.word === wordToToggle.word) {
          return { ...word, isFavorite: !word.isFavorite }
        }
        return word
      })
      
      setSavedWords(updatedWords)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords))
      
      // Re-apply filter
      filterWords(activeFilter)
    } catch (error) {
      console.error("Error toggling favorite:", error)
      Alert.alert("Error", "Failed to update favorite status.")
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "#4CAF50"
      case "medium":
        return "#FF9800"
      case "hard":
        return "#F44336"
      default:
        return "#9D4EDD"
    }
  }

  const renderWordItem = ({ item }: { item: WordData }) => {
    const isExpanded = expandedWord === item.word
    const difficultyColor = getDifficultyColor(item.difficulty)

    return (
      <BlurView
        intensity={15}
        tint="dark"
        style={[styles.wordCard, isExpanded && styles.expandedCard]}
      >
        <TouchableOpacity 
          onPress={() => toggleWordExpansion(item.word)}
          activeOpacity={0.9}
          style={styles.wordCardInner}
        >
          <View style={styles.wordHeader}>
            <View style={styles.wordInfo}>
              <Text style={styles.date}>{item.date || "Today"}</Text>
              <View style={styles.wordTitleRow}>
                <Text style={styles.wordText}>{item.word}</Text>
                {item.difficulty && (
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                    <Text style={styles.difficultyText}>{item.difficulty}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.partOfSpeech}>{item.partOfSpeech}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons
                  name={item.isFavorite ? "heart" : "heart-outline"}
                  size={18}
                  color={item.isFavorite ? "#e07aff" : "white"}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.expandButton}>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.meaningText}>{item.meaning}</Text>
          
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.examplesHeader}>Examples:</Text>
              {item.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <Text style={styles.exampleBullet}>•</Text>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      </BlurView>
    )
  }

  const renderEmptyState = () => (
    <BlurView intensity={15} tint="dark" style={styles.emptyState}>
      <Ionicons name="book-outline" size={60} color="rgba(255, 255, 255, 0.5)" />
      <Text style={styles.emptyTitle}>No words found</Text>
      <Text style={styles.emptyText}>
        {activeFilter === "all"
          ? "You haven't saved any words yet. Words will appear here as you learn them."
          : activeFilter === "favorites"
            ? "You don't have any favorite words yet."
            : `You don't have any ${activeFilter} difficulty words saved yet.`}
      </Text>
    </BlurView>
  )

  // If no saved words, show demo data
  useEffect(() => {
    if (savedWords.length === 0) {
      const demoWords = [
        {
          word: "Ephemeral",
          meaning: "Lasting for a very short time",
          partOfSpeech: "adjective",
          difficulty: "medium",
          examples: [
            "The ephemeral beauty of cherry blossoms lasts only a few days.",
            "Fame can be ephemeral, here today and gone tomorrow.",
            "She enjoyed the ephemeral pleasure of a perfect summer day."
          ],
          date: "May 15, 2025",
          isFavorite: true
        },

      ]
      
      setSavedWords(demoWords)
      setFilteredWords(demoWords)
      setTotalWords(demoWords.length)
      setWordsThisWeek(3) // For demo purposes
    }
  }, [])


const MyHeader = () => {
  return (
    <View style={styles.statsCardContainer}>
      <StatsCard totalWords={totalWords} wordsThisWeek={wordsThisWeek} />
    </View>
  );
};

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dwbdtvo3s/image/upload/v1745057357/xwori62wi2y0lfcyanop.jpg",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <BlurView intensity={20} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Your Progress</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleClearHistory}
            >
              <Ionicons name="trash-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </BlurView>

      

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollableFilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </View>

        {/* Word List */}
        <FlatList
          data={filteredWords}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
           ListHeaderComponent={MyHeader}
        />

        {/* Export Button */}
        {/* <TouchableOpacity style={styles.exportButton} onPress={handleExportHistory}>
          <LinearGradient
            colors={["#9D4EDD", "#7B2CBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.exportButtonGradient}
          >
            <Ionicons name="download-outline" size={20} color="#fff" style={styles.exportIcon} />
            <Text style={styles.exportButtonText}>Export Words</Text>
          </LinearGradient>
        </TouchableOpacity> */}
      </SafeAreaView>
    </ImageBackground>
  )
}

// Scrollable filter tabs component
function ScrollableFilterTabs({ 
  activeFilter, 
  onFilterChange 
}: { 
  activeFilter: string,
  onFilterChange: (filter: string) => void
}) {
  const filters = [
    { id: "all", label: "All Words" },
    { id: "favorites", label: "Favorites" },
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" }
  ]

  return (
    <FlatList
      data={filters}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const isActive = activeFilter === item.id
        return (
          <TouchableOpacity
            style={[
              styles.filterTab,
              isActive && styles.activeFilterTab
            ]}
            onPress={() => onFilterChange(item.id)}
          >
            {isActive ? (
              <LinearGradient
                colors={["#e07aff", "#9D4EDD"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeFilterGradient}
              >
                <Text style={styles.filterTabText}>{item.label}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.filterTabText}>{item.label}</Text>
            )}
          </TouchableOpacity>
        )
      }}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.filterTabsContainer}
    />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "Title-light",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  statsCardContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  filterContainer: {
    paddingVertical: 15,
  },
  filterTabsContainer: {
    paddingHorizontal: 20,
  },
  filterTab: {
    marginRight: 10,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  activeFilterTab: {
    borderColor: "#9D4EDD",
  },
  activeFilterGradient: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: -8,
    marginHorizontal: -16,
  },
  filterTabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SUB",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  wordCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.3)",
  },
  wordCardInner: {
    padding: 16,
  },
  expandedCard: {
    borderColor: "rgba(224, 122, 255, 0.5)",
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  wordInfo: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
    fontFamily: "SUB",
  },
  wordTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  wordText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
    fontFamily: "SUBOLD",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#9D4EDD",
  },
  difficultyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
    fontFamily: "SUB",
  },
  partOfSpeech: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    marginTop: 2,
    fontFamily: "SUB",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  meaningText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
    lineHeight: 22,
    fontFamily: "SUB",
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 12,
  },
  examplesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    fontFamily: "SUBOLD",
  },
  exampleItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  exampleBullet: {
    fontSize: 16,
    color: "#e07aff",
    marginRight: 8,
    marginTop: 2,
  },
  exampleText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
    lineHeight: 22,
    fontFamily: "SUB",
  },
  exportButton: {
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
  exportButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  exportIcon: {
    marginRight: 8,
  },
  exportButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.3)",
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 16,
    fontFamily: "SUBOLD",
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "SUB",
    lineHeight: 20,
  },
})
