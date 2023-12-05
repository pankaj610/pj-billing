import React from 'react'
import { Text, View } from 'react-native'
import tw from '../../utils.js/tw'

function Row({ label, value, style, labelStyle, valueStyle }: { label: string, value: string | number, style?: string, labelStyle?: string, valueStyle?: string }) {
    return (
        <View style={tw`flex flex-row ${style}`}>
            <Text style={tw`flex flex-1 ${labelStyle}`}>{label} : </Text>
            <Text style={tw`flex flex-1 ${valueStyle}`}>{value}</Text>
        </View>
    )
}

export default Row