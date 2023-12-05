import React from 'react';
import { Button, Text, View, ImageBackground, Image } from 'react-native';
import { useAppStore } from '../../store/appStore';
import IMAGES from '../../constants/Images';
import tw from '../../utils.js/tw';
import StyledImage from '../common/StyledImage';

const Login: React.FC<{}> = () => {
	const { login, loading } = useAppStore();

	return (
		<ImageBackground source={{
			uri: IMAGES.background,
		}} style={tw`w-full h-full`}>
			<View style={tw`center-h flex-1`}>
				<StyledImage url={IMAGES.logo} style={tw`h-30 w-30`} />
			</View>
			<View style={tw`flex-1 center-h`}>
				<Button color={'green'} title="Google Login" onPress={login} />
			</View>
		</ImageBackground>
	);
};



export default Login;
