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
  Alert
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define interfaces for the word data
interface WordData {
  word: string
  meaning: string
  partOfSpeech: string
  difficulty?: string
  examples: string[]
}

// Storage key for saved words
const STORAGE_KEY = "@wordly_saved_words"

export default function HistoryScreen({ navigation }: { navigation: any }) {
  const [savedWords, setSavedWords] = useState<WordData[]>([])
  const [filteredWords, setFilteredWords] = useState<WordData[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [expandedWord, setExpandedWord] = useState<string | null>(null)

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
      setSavedWords(words)
      setFilteredWords(words)
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
    // For now, just show an alert
    Alert.alert(
      "Export Words",
      "This feature will allow you to export your saved words to a file. Coming soon!",
      [{ text: "OK" }]
    )
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

  const toggleWordExpansion = (word: string) => {
    if (expandedWord === word) {
      setExpandedWord(null)
    } else {
      setExpandedWord(word)
    }
  }

  const renderWordItem = ({ item }: { item: WordData }) => {
    const isExpanded = expandedWord === item.word
    const difficultyColor = getDifficultyColor(item.difficulty)

    return (
      <TouchableOpacity 
        style={styles.wordCard}
        onPress={() => toggleWordExpansion(item.word)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={["rgba(157, 78, 221, 0.4)", "rgba(92, 24, 154, 0.6)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCard, isExpanded && styles.expandedCard]}
        >
          <View style={styles.wordHeader}>
            <View style={styles.wordTitleContainer}>
              <Text style={styles.wordText}>{item.word}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                <Text style={styles.difficultyText}>
                  {item.difficulty || "N/A"}
                </Text>
              </View>
            </View>
            <Text style={styles.partOfSpeech}>{item.partOfSpeech}</Text>
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
          
          <View style={styles.cardFooter}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="rgba(255, 255, 255, 0.8)"
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyTitle}>No words found</Text>
      <Text style={styles.emptyText}>
        {activeFilter === "all"
          ? "You haven't saved any words yet. Words will appear here as you learn them."
          : `You don't have any ${activeFilter} difficulty words saved yet.`}
      </Text>
    </View>
  )

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
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>My Word History</Text>
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
        />

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={handleExportHistory}>
          <LinearGradient
            colors={["#9D4EDD", "#7B2CBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.exportButtonGradient}
          >
            <Ionicons name="download-outline" size={20} color="#fff" style={styles.exportIcon} />
            <Text style={styles.exportButtonText}>Export Words</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "SUB",
    fontWeight: "bold",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  wordCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  expandedCard: {
    borderColor: "rgba(224, 122, 255, 0.5)",
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  wordTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
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
  },
  partOfSpeech: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
  },
  meaningText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
    lineHeight: 22,
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
  },
  cardFooter: {
    alignItems: "center",
    marginTop: 8,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});