import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import BottomNavigation from './BottomTab';
import { useNavigation } from '@react-navigation/native';
import MyHeader from '../components/layout/MyHeader';
import { APP_NAME } from '../constants';
import { useAppStore } from '../store/appStore';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
	const { signOut } = useAppStore();

	return (
		<Drawer.Navigator
			screenOptions={{
				drawerType: 'slide',
			}}
			drawerContent={(props) => {
				return (
					<DrawerContentScrollView {...props}>
						<DrawerItemList {...props} />
						<DrawerItem label="Logout" onPress={() => signOut()} />
					</DrawerContentScrollView>
				);
			}}>
			<Drawer.Screen
				component={BottomNavigation}
				name="Billing"
				options={() => ({
					header: () => {
						return (
							<MyHeader
								title={APP_NAME}
							/>
						);
					},
					swipeEnabled: true,
				})}
			/>
		</Drawer.Navigator>
	);

}


export default DrawerNavigation;
