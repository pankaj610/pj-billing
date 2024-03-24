import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const FullScreenLoadingContainer = ({ color = '#ff597e', size = 'large', backgroundColor }: { color?: string, backgroundColor?: string, size?: number | 'small' | 'large' | undefined }) => {
    return (
        <View style={[styles.container, { backgroundColor }]} >
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export default FullScreenLoadingContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})