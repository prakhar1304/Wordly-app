
// api/wordApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WordData {
  word: string;
  meaning: string;
  difficulty: string;
  type: string;
  examples: string[];
}

const API_URL = 'https://wordoftheday-aco3.onrender.com/api/v1/vocab-word';
const STORAGE_KEY = '@word_of_the_day';

export const fetchWordOfTheDay = async (): Promise<WordData> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch word of the day');
    }
    
    const data: WordData = await response.json();
    
    // Store in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error fetching word:', error);
    
    // Try to get cached word from AsyncStorage
    const cachedWord = await AsyncStorage.getItem(STORAGE_KEY);
    if (cachedWord) {
      return JSON.parse(cachedWord);
    }
    
    // If no cached word, return a default word
    return {
      word: 'Error',
      meaning: 'Failed to fetch word. Please try again later.',
      difficulty: 'N/A',
      type: 'N/A',
      examples: ['No examples available']
    };
  }
};

export const getCachedWord = async (): Promise<WordData | null> => {
  try {
    const cachedWord = await AsyncStorage.getItem(STORAGE_KEY);
    return cachedWord ? JSON.parse(cachedWord) : null;
  } catch (error) {
    console.error('Error getting cached word:', error);
    return null;
  }
};