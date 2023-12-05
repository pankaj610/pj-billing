import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import RootNavigation from './router/RootNavigation';

import { QueryClientProvider, QueryClient } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAppStore } from './store/appStore';
import SplashScreen from './components/screens/SplashScreen';

GoogleSignin.configure();

const queryClient = new QueryClient();
const AppEntry = () => {

	const { restoreUser, isRestoring } = useAppStore();

	useEffect(() => {
		restoreUser();
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<QueryClientProvider client={queryClient}>
				<PaperProvider>
					<NavigationContainer>
						{isRestoring ? <SplashScreen /> : <RootNavigation />}
					</NavigationContainer>
				</PaperProvider>
			</QueryClientProvider>
		</GestureHandlerRootView>
	);

}

export default AppEntry;
