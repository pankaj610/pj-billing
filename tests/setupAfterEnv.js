import 'react-native';
import mockAsyncStorage from  '/@react-native-async-storage/jest/async-storage-mock';


jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);