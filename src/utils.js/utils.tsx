
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateInvoiceHtml } from './invoice/html';

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

export const convertToPrice = (num: string | number) => {
    if (typeof num == 'number') {
        num = String(num);
    }
    return `₹ ${parseInt(num).toLocaleString('en-IN')}`;
}

export const getInvoiceHtml = (jsonData, customerData) => {
    console.log(JSON.stringify(customerData, null, 2))
    return generateInvoiceHtml(jsonData, customerData)
}