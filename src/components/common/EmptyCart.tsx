import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const EmptyCart = () => {
    return (
        <View style={styles.container} >
            <Image source={require('../../../assets/empty-cart.png')} style={styles.emptyImage} />
        </View>
    );
};

export default EmptyCart;

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