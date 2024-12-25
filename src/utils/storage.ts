import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeStorage = async () => {
  try {
    // Create necessary directories by writing and reading a test value
    await AsyncStorage.setItem('@storage_test', 'test');
    await AsyncStorage.removeItem('@storage_test');
    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
};

export const storage = {
  set: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  },

  get: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
}; 