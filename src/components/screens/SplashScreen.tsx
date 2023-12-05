import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import tw from '../../utils.js/tw'
import { Text } from 'react-native'

function SplashScreen() {
    return (
        <View style={tw`flex-1 text-yellow center-v`}>
            <ActivityIndicator size="large" color='green' />
            <Text style={tw`title text-lg text-black mt-3`}>Loading App</Text>
        </View>
    )
}

export default SplashScreen