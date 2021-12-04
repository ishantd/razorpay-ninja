import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput, Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const storeData = async (key, value) => {
    await AsyncStorage.setItem(key, value)
}


function ShopOnboarding (props) {
    const [location, setLocation] = useState(null);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const navigation = useNavigation();

    const createProfile = () => {
        const requestOptions = {
            method : 'post',
            url : '/accounts/profiles/',
            data : { phone: phone, role: 'owner' }
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { createShop(); }).catch((error) => { console.error(error); });
    }

    const createShop = () => {
        const requestOptions = {
            method : 'post',
            url : '/accounts/shop/',
            data : { name: name, address: address, location: `${location.coords.latitude},${location.coords.longitude}` }
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { storeData('shop', JSON.stringify(response.data.shop_data)); navigation.navigate('AppScreens'); }).catch((error) => { console.error(error); });
    }

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocation(null);
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          console.log(location);
        })();
    }, []);

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.headerTextName}>Shop Setup</Text>
                    <Text style={styles.headerTextDetails}>Enter the following details to set up your shop.</Text>
                </View>
            </View>
            <View style={modalStyles.inputContainer}>
                <TextInput keyboardType='name-phone-pad' style={modalStyles.inputBox} placeholder="Shop Name" value={name} onChangeText={(name) => setName(name)}/>
                <TextInput keyboardType='numeric' style={modalStyles.inputBox} placeholder="Phone Number" maxLength={10} value={phone} onChangeText={(name) => setPhone(name)}/>
                <TextInput keyboardType='name-phone-pad' multiline={true} underlineColorAndroid='transparent' style={modalStyles.inputBox} placeholder="Shop Address" value={address} onChangeText={(address) => setAddress(address)}/>
            </View>
            <Text style={modalStyles.modalText}>Note: Clicking "Create Shop" will set your current location as the shop's geolocation. This is used to verify attendance. Please proceed only when you're at your shop.</Text>
            <View style={styles.buttonsContainer}>
                {
                    location ? 
                    <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => createProfile()}>
                        <Text style={styles.buttonText}>Create Shop</Text>
                    </TouchableOpacity> : 
                    <Text style={styles.headerTextDetails}>Premission to location was denied. Please go to settings and allow RazorpayNinja access to your location to proceed.</Text>
                }
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
        backgroundColor: '#0A6FEB',
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
        marginVertical: 8,
    },

    headerTextDetails: {
        fontSize: 16,
        marginVertical: 4,
    },

    buttonsContainer: {
        marginVertical: 48,
    },

    button: {
        backgroundColor: '#0A6FEB',
        borderRadius: 4,

        marginVertical: 8,
        marginHorizontal: 16,

        paddingVertical: 16,

        width: Dimensions.get('window').width - 64,
    },

    buttonRed: {
        backgroundColor: '#D44333',
        borderRadius: 4,

        marginVertical: 8,
        marginHorizontal: 16,

        paddingVertical: 16,
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    }
});

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 16,
    },

    inputContainer: {
        marginVertical: 16,
    },

    inputBox: {
        borderColor: '#0A6FEB',
        borderRadius: 4,
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,

        fontSize: 16,

        marginVertical: 8,

        width: Dimensions.get('window').width - 64,
    },

    button: {
        backgroundColor: '#0A6FEB',
        borderRadius: 4,
        paddingVertical: 8,
        width: Dimensions.get('window').width - 128,
        marginHorizontal: 16,
    },

    buttonRed: {
        backgroundColor: '#D44333',
        borderRadius: 4,
        paddingVertical: 8,
        width: '45%',
        marginHorizontal: 16
    },

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    modalText: {
        marginHorizontal: 8,
        marginVertical: 32,
        fontSize: 12
    },

    qrImage: {
        width: 256,
        height: 256,
    }
});

export default ShopOnboarding;