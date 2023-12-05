
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
    save: async (key, data) => {
        let json = JSON.stringify(data);
        await AsyncStorage.setItem(key, json);
    },
    get: async (key) => {
        let json = await AsyncStorage.getItem(key);
        return JSON.parse(json);
    },
    remove: async (key) => {
        await AsyncStorage.removeItem(key);
    },
    removeAll: async () => {
        await AsyncStorage.clear();
    },
}
