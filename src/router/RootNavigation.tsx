import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../components/screens/Login';
import DrawerNavigation from './DrawerNavigation';
import { enableScreens } from 'react-native-screens';
import { useAppStore } from '../store/appStore';
import CreateCustomer from '../components/screens/billing/CreateCustomer';
import CustomerBills from '../components/screens/billing/CustomerBills';
import CreateBill from '../components/screens/billing/CreateBill';
enableScreens();

const Stack = createNativeStackNavigator();


const ROUTES = {
	PUBLIC: {
		LOGIN: {
			name: 'Login',
			component: Login,
		}
	},
	PRIVATE: {
		DRAWER: {
			name: 'Drawer Stack',
			component: DrawerNavigation,
		},
		CREATE_CUSTOMER: {
			name: 'Create Customer',
			component: CreateCustomer,
		},
		CREATE_STOCK: {
			name: 'Create Stock',
			component: DrawerNavigation,
		},
		CUSTOMER_BILLS: {
			name: 'Customer Bills',
			component: CustomerBills,
		},
		CREATE_BILL: {
			name: 'Create Bill',
			component: CreateBill,
		}
	}
}

export const APP_ROUTES = ROUTES.PRIVATE;

const RootNavigation = () => {
	const { isLoggedIn, restoreUser } = useAppStore();

	return isLoggedIn ? (
		<Stack.Navigator>
			{Object.keys(ROUTES.PRIVATE).map((key) => {
				const route = APP_ROUTES[key];
				return (
					<Stack.Screen
						key={route.name}
						component={route.component}
						name={route.name}
						options={{ headerShown: route.name != ROUTES.PRIVATE.DRAWER.name }}
					/>
				);
			})}
		</Stack.Navigator>
	) : (
		<Stack.Navigator>
			{Object.keys(ROUTES.PUBLIC).map((key) => {
				const route = ROUTES.PUBLIC[key];
				return (
					<Stack.Screen
						key={route.name}
						component={route.component}
						name={route.name}
						options={{ headerShown: false }}
					/>
				);
			})}
		</Stack.Navigator>
	);
};

export default RootNavigation;
