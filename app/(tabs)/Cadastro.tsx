import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Image, Button, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { onBoardingContent } from '../../assets/onBoardingContent'
import { Link, router } from 'expo-router';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function Cadastro() {
    const [loaded, error] = useFonts({
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
        'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    });

    if (loaded) {
        return (
            <GestureHandlerRootView>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}>


                    <View style={styles.container}>
                        <Image style={styles.logo} source={
                            require('../../assets/images/logo.png')
                        } />
                        <Text style={styles.titulo}>Cadastro</Text>
                        <Text style={styles.infoText}>Encontre os melhores spots, descubra eventos e junte-se a comunidade!</Text>

                        <View style={styles.loginAlternavivesView}>
                            <TouchableOpacity style={styles.loginAlternavivesButton}>
                                <Image style={{ width: 20, height: 'auto' }} source={require('../../assets/images/google.png')} />
                                <Text> Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.loginAlternavivesButton}>
                                <Image style={{ width: 20, height: 'auto' }} source={require('../../assets/images/facebook.png')} />
                                <Text> Facebook</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 28, flexDirection: 'row', }}>
                            <Text style={styles.infoText}>Cadastre-se</Text>
                        </View>

                        <View style={styles.formRegister}>
                            <Text style={styles.formFieldTitle}>Nome</Text>
                            <TextInput style={styles.formInputText} />

                            <Text style={styles.formFieldTitle}>E-mail</Text>
                            <TextInput style={styles.formInputText} />

                            <Text style={styles.formFieldTitle}>Senha</Text>
                            <TextInput secureTextEntry={true} style={styles.formInputText} placeholder='********' />
                        </View>



                        <Link href="/home" style={styles.button}>
                            <Text style={styles.textButton}>Cadastrar</Text>
                        </Link>

                    </View>
                </ScrollView>
            </GestureHandlerRootView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0C0A14',
        paddingHorizontal: 16
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        height: 109,
        resizeMode: 'contain',
        top: -16,
    },
    titulo: {
        color: '#fff',
        fontFamily: 'Quicksand-Bold',
        fontSize: 22,
        lineHeight: 27.5,
        letterSpacing: 0.11,
        textAlign: 'center',
        marginTop: 180
    },
    infoText: {
        color: '#fff',
        fontFamily: 'Quicksand-Regular',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 17.5,
        letterSpacing: 0.11,
        textAlign: 'center',
        marginHorizontal: 28,
        marginTop: 12
    },
    button: {
        backgroundColor: '#9747FF',
        borderRadius: 8,
        paddingHorizontal: 42,
        paddingVertical: 8,
        position: 'fixed',
        bottom: -32,

    },
    textButton: {
        color: '#fff',
        fontFamily: 'Quicksand-Bold',
        fontSize: 22,
        lineHeight: 27.5,
        letterSpacing: 0.11,
        textAlign: 'center',
    },
    loginAlternavivesView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,

    },
    loginAlternavivesButton: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#262626B2',
        paddingHorizontal: 42,
        paddingVertical: 8,
        marginHorizontal: 14
    },
    formRegister: {
        width: '100%'
    },
    formFieldTitle: {
        color: '#F5D907',
        fontFamily: 'Quicksand-Bold',
        fontSize: 14,
        lineHeight: 17.5,
        letterSpacing: 0.11,
        textAlign: 'left',
        marginTop: 24,
        marginHorizontal: 16,

    },
    formInputText: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 12,
        paddingHorizontal: 16,

    }

});

export default Cadastro