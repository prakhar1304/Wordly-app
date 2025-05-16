import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WordData } from '../api/word';

interface WordCardProps {
  wordData: WordData;
}

export const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.word}>{wordData.word}</Text>
      <View style={styles.typeContainer}>
        <Text style={styles.type}>{wordData.type}</Text>
        <Text style={styles.difficulty}>Difficulty: {wordData.difficulty}</Text>
      </View>
      <Text style={styles.meaning}>{wordData.meaning}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  word: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  type: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  difficulty: {
    fontSize: 14,
    color: '#888',
  },
  meaning: {
    fontSize: 18,
    lineHeight: 24,
    color: '#444',
  },
});