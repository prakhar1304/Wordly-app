// services/wordService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define our data types
export interface WordData {
  word: string;
  meaning: string;
  partOfSpeech: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: string[];
  dateAdded: string;
}

// The array to store the word history
const WORD_HISTORY_KEY = '@wordly_history';

// Function to get word from Gemini API
export const fetchNewWord = async (): Promise<WordData | null> => {
  try {
    const API_KEY = 'AIzaSyBuDWeawUjROa5NQDf0A9vBi56Rc362-n8';
    const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
    
    const prompt = `
      Create a vocabulary word of the day with the following JSON format:
      {
        "word": "a moderately difficult English word",
        "meaning": "a clear and concise definition",
        "partOfSpeech": "noun/verb/adjective/adverb/etc.",
        "difficulty": "easy/medium/hard",
        "examples": ["example sentence 1", "example sentence 2", "example sentence 3"]
      }
      
      Return only the JSON object with no additional text.
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    
    // Find the JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : null;
    
    if (!jsonStr) {
      throw new Error('Invalid response format from API');
    }
    
    // Parse the JSON
    const wordData = JSON.parse(jsonStr);
    
    // Add the dateAdded field with current date
    const result: WordData = {
      ...wordData,
      dateAdded: new Date().toISOString()
    };
    
    // Save to history immediately
    await saveWordToHistory(result);
    
    return result;
  } catch (error) {
    console.error('Error fetching word data:', error);
    return null;
  }
};

// Function to save word to history in AsyncStorage
export const saveWordToHistory = async (word: WordData): Promise<void> => {
  try {
    // Get existing history
    const existingHistoryStr = await AsyncStorage.getItem(WORD_HISTORY_KEY);
    const existingHistory: WordData[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
    
    // Check if the word already exists in history
    const wordExists = existingHistory.some(item => item.word === word.word);
    
    if (!wordExists) {
      // Add new word to the beginning of the array
      const updatedHistory = [word, ...existingHistory];
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(WORD_HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Error saving word to history:', error);
  }
};

// Function to get word history from AsyncStorage
export const getWordHistory = async (): Promise<WordData[]> => {
  try {
    const historyStr = await AsyncStorage.getItem(WORD_HISTORY_KEY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (error) {
    console.error('Error getting word history:', error);
    return [];
  }
};

// Function to clear word history
export const clearWordHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WORD_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing word history:', error);
  }
};

// Helper function to get fallback words in case API fails
export const getFallbackWord = (): WordData => {
  const fallbackWords: WordData[] = [
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
      dateAdded: new Date().toISOString()
    },
    {
      word: "Serendipity",
      meaning: "The occurrence of events by chance in a happy or beneficial way",
      partOfSpeech: "noun",
      difficulty: "hard",
      examples: [
        "Finding my dream job was pure serendipity—I wasn't even looking for work!",
        "By serendipity, she met her future husband while waiting for a bus.",
        "The discovery of penicillin was a case of scientific serendipity."
      ],
      dateAdded: new Date().toISOString()
    },
    {
      word: "Mellifluous",
      meaning: "Sweet or musical; pleasant to hear",
      partOfSpeech: "adjective",
      difficulty: "hard",
      examples: [
        "The singer's mellifluous voice captivated the entire audience.",
        "The mellifluous sound of the wind chimes helped her relax.",
        "His mellifluous speech made even the dullest topics interesting."
      ],
      dateAdded: new Date().toISOString()
    }
  ];
  
  return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
};