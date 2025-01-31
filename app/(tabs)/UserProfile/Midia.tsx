import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Image, Button, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableHighlight, ImageBackground, FlatList } from 'react-native';
import { midiaAssets } from './midiaAssets'


export default function Midia() {

    const windowWidth = Dimensions.get('window').width - 32;

    const [loaded, error] = useFonts({
        'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
        'Quicksand-Regular': require('../../../assets/fonts/Quicksand-Regular.ttf'),
    });

    const item = (
        

    <FlatList
        contentContainerStyle={{ alignSelf: 'center', gap: 8}}
        numColumns={3}
        data={midiaAssets}
        renderItem={({ item, index }) =>
            <TouchableHighlight style={[styles.midiaImageHandler]} >
                <Image style={[styles.midiaImage]} source={item.image}></Image>
            </TouchableHighlight>
        }
    />




    )


    if (loaded)
        return (
            <>

                <View style={styles.container}>
                    <Text style={styles.textMidia}>Mídia</Text>

                    {
                        <View style={styles.midiaContainer}>
                            <View style={styles.row}>
                                {item}
                            </View>
                        </View>
                    }
                </View>
            </>

        )
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 32
    },
    textMidia: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 22,
        lineHeight: 35,
        color: '#212121',
    },
    midiaContainer: {
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    midiaImageHandler: {
        marginHorizontal: 8
    },
    midiaImage: {
        backgroundColor: '#C9C9C9',
        borderRadius: 16,
        resizeMode:'cover',
        width: 110,
        height: 110
    },
    pistaName: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 16,
        lineHeight: 20,
        color: '#212121',
        textAlign: 'center',

    }
})
