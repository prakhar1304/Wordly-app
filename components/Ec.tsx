import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { WordData } from '../api/word';

interface ExamplesCardProps {
  wordData: WordData;
}

export const ExamplesCard: React.FC<ExamplesCardProps> = ({ wordData }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Examples</Text>
      <FlatList
        data={wordData.examples}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.exampleItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.exampleText}>{item}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 5,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#555',
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
    color: '#444',
  },
});