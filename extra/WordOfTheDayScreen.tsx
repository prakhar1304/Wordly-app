import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { WordCard } from '../components/wc';
import { ExamplesCard } from '../components/Ec';
import { fetchWordOfTheDay, WordData } from '../api/word';

export const WordOfTheDayScreen: React.FC = () => {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWord = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWordOfTheDay();
      setWordData(data);
    } catch (err) {
      setError('Failed to load word of the day');
      console.error('Error loading word:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWord();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6750A4" />
        <Text style={styles.loadingText}>Loading word of the day...</Text>
      </View>
    );
  }

  if (error || !wordData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
        <TouchableOpacity style={styles.button} onPress={loadWord}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Word of the Day</Text>
      
      <WordCard wordData={wordData} />
      
      <ExamplesCard wordData={wordData} />
      
      <TouchableOpacity style={styles.button} onPress={loadWord}>
        <Text style={styles.buttonText}>Get New Word</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#e53935',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6750A4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
