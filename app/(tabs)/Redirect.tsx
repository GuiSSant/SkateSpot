import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Alert,
    Image,
    Button,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useFonts } from "expo-font";
import { onBoardingContent } from "../../assets/onBoardingContent";
import { Link, router } from "expo-router";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function Redirect() {
    const [loaded, error] = useFonts({
        "Quicksand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
        "Quicksand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
    });

    if (loaded) {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require("../../assets/images/logo.png")}
                />
                <Text style={styles.titulo}>Recirecionamento</Text>
                <Text style={styles.infoText}>
                    Selecione a opção que deseja
                </Text>

                <View style={styles.loginAlternavivesView}>
                    <Link href="/(tabs)/Explore" style={styles.mainButton}>
                        <Text style={styles.textButton}> Explore</Text>
                    </Link>
                    <Link href="/(tabs)/FormCadastros/FormLocal" style={styles.mainButton}>
                        <Text style={styles.textButton}> Cadastrar Local</Text>
                    </Link>
                    <Link href="/(tabs)/Login/Login" style={styles.mainButton}>
                        <Text style={styles.textButton}> Login</Text>
                    </Link>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#0C0A14",
        paddingHorizontal: 16,
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: 109,
        resizeMode: "contain",
        top: -16,
    },
    titulo: {
        color: "#fff",
        fontFamily: "Quicksand-Bold",
        fontSize: 22,
        lineHeight: 27.5,
        letterSpacing: 0.11,
        textAlign: "center",
        marginTop: 180,
    },
    infoText: {
        color: "#fff",
        fontFamily: "Quicksand-Regular",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 17.5,
        letterSpacing: 0.11,
        textAlign: "center",
        marginHorizontal: 28,
        marginTop: 12,
    },
    mainButton: {
        backgroundColor: "#9747FF",
        borderRadius: 8,
        paddingHorizontal: 42,
        paddingVertical: 8,
        position: "relative",
        marginTop: 32
    },
    textButton: {
        color: "#fff",
        fontFamily: "Quicksand-Bold",
        fontSize: 22,
        lineHeight: 27.5,
        letterSpacing: 0.11,
        textAlign: "center",
    },
    loginAlternavivesView: {
        justifyContent: "space-between",
        marginTop: 24,
    },
    loginAlternavivesButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#262626B2",
        paddingHorizontal: 42,
        paddingVertical: 8,
        marginHorizontal: 14,
        alignItems: 'center'
    },
    formRegister: {
        width: "100%",
    },
    formFieldTitle: {
        color: "#F5D907",
        fontFamily: "Quicksand-Bold",
        fontSize: 14,
        lineHeight: 17.5,
        letterSpacing: 0.11,
        textAlign: "left",
        marginTop: 24,
        marginHorizontal: 16,
    },
    formInputText: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginTop: 12,
        paddingHorizontal: 16,
        height: 36,
    },
});

export default Redirect;
