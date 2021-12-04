import React, { useEffect, useState } from 'react'
import * as Google from 'expo-google-app-auth';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput, Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { axiosAuthorizedInstance, axiosRequestAuthInstance } from '../CustomAxios/customAxios';

const storeData = async (value) => {
    await AsyncStorage.setItem('key', value)
}

function LoginPage (props) {
    const navigation = useNavigation();

    const googleLogin = async () => {
        try{
            const result = await Google.logInAsync({
                iosClientId : `133149144745-ombhlr10huq710h3aciia0kbko2lt93j.apps.googleusercontent.com`,
                androidClientId: `133149144745-a21b3c0c5mfr971m9udrg9eubftv14c7.apps.googleusercontent.com`,
                clientId : '133149144745-pv4bv47njenj3jacusshmvhggq72cect.apps.googleusercontent.com',
                scopes : ['profile', 'email', 'phone']
            });

            console.log(result);

            const requestOptions = {
                method : 'post',
                url : '/accounts/auth/google/',
                data : { access_token : result.accessToken }
            }
            axiosRequestAuthInstance(requestOptions).then((response) => { storeData(response.data.key); navigation.navigate('ShopOnboarding') }).catch((error) => { console.error(error); });
        } 
        catch(error) { console.error(error) }
    }

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Image style={styles.headerImage} source={require('../assets/logo-lg.png')}/>
                <View style={styles.headerText}>
                    <Text style={styles.headerTextName}>Welcome to RazorpayNinja</Text>
                    <Text style={styles.headerTextDetailsBold}>RazorpayNinja makes it easy for you to manage your shop, employees, payments and customer engagement.</Text>
                    <Text style={styles.headerTextDetails}>Continue with your Google account to making shopkeeping a breeze!</Text>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => googleLogin()}>
                    <Ionicons name="logo-google" size={30} color="#fff" />
                    <Text style={styles.buttonText}>Continue With Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    header: {
        marginVertical: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerImage: {
        width: 96,
        height: 96,
        backgroundColor: '#09153B',
        borderRadius: 64,
        marginBottom: 16
    },

    headerText: {
        alignItems: 'center',
        textAlign: 'center',
    },

    headerTextName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 24,
        marginBottom: 48,
        marginHorizontal: 32,
    },

    headerTextDetailsBold: {
        fontSize: 16,
        marginVertical: 8,
        marginHorizontal: 32,
        fontWeight: 'bold',
        textAlign: 'justify'
    },

    headerTextDetails: {
        fontSize: 16,
        marginVertical: 8,
        marginHorizontal: 32,
        textAlign: 'justify'
    },

    buttonsContainer: {
        marginVertical: 48,
    },

    button: {
        backgroundColor: '#0A6FEB',
        borderRadius: 4,

        marginVertical: 8,
        marginHorizontal: 16,

        paddingVertical: 12,

        width: Dimensions.get('window').width - 64,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',

        marginLeft: 16,
    }
});

export default LoginPage;