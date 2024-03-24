import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const EmptyList = () => {
    return (
        <View style={styles.container} >
            <Image source={require('../../../assets/out-of-stock.png')} style={styles.emptyImage} />
        </View>
    );
};

export default EmptyList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        height: 200,
        width: 200,
    }
})