import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';

const PDFViewer = () => {
    const route = useRoute()
    const pdfUrl = route.params?.url
    const source = { uri: pdfUrl, cache: true };

    const handleLoadComplete = (numberOfPages, filePath) => {
        console.log(`Number of pages: ${numberOfPages}`);
    };

    const handlePageChanged = (page, numberOfPages) => {
        console.log(`Current page: ${page}`);
    };

    const handleError = (error) => {
        console.log(error);
    };

    const handlePressLink = (uri) => {
        console.log(`Link pressed: ${uri}`);
    };

    return (
        <View style={styles.container}>
            <Pdf
                source={source}
                onLoadComplete={handleLoadComplete}
                onPageChanged={handlePageChanged}
                onError={handleError}
                onPressLink={handlePressLink}
                style={styles.pdf}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default PDFViewer;
