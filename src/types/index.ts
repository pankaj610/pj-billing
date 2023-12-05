import { User } from '@react-native-google-signin/google-signin';
import { Customer } from './billing';

export interface AppStateType {
	isLoggedIn: boolean;
	loading: boolean;
	isRestoring: boolean;
	goldPrice: number;
	silverPrice: number;
	user: User | null;
	customers: Customer[];
	setLoggedIn: (value: boolean) => void;
	login: () => void;
	restoreUser: () => void;
	signOut: () => void;
	getCustomer: (search: string) => void;
	getTodaysCustomers: () => void;
}
