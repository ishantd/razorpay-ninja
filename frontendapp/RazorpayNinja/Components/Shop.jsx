import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logOutAsync } from 'expo-google-app-auth';
import { useNavigation } from '@react-navigation/native';
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';

const removeData = async (key) => {
    await AsyncStorage.removeItem(key);
}

function Shop (props) {
    const [modalVisible, setModalVisible] = useState(false);

    const [shopData, setShopData] = useState();
    const [addressData, setAddressData] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchValue() {    
            const shop = await AsyncStorage.getItem('shop');
            const shopJSON = JSON.parse(shop);
            console.log(shopJSON);
            setShopData(shopJSON);
            setAddressData(shopJSON.address_string.split('\n'));
        }

        fetchValue();
    }, []);

    const logOut = () => {
        const requestOptions = {
            method : 'post',
            url : '/auth/logout/',
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { removeData('key').then(() => removeData('shop').then(() => navigation.push('LoginScreen'))) }).catch((error) => { console.error(error) });
    }

    return (
        shopData && addressData ?
        <View style={styles.page}>
            <View style={styles.header}>
                <View style={styles.headerImage}/>
                <View style={styles.headerText}>
                    <Text style={styles.headerTextName}>{shopData.name}</Text>
                    { addressData.map((string, index) => <Text style={styles.headerTextDetails} key={index}>{string}</Text>) }
                    <Text style={styles.headerTextDetailsBold}>Shop Code - {shopData.unique_code}</Text>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Edit Shop Details</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.buttonRed} onPress={() => logOut()}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType='fade' transparent={true} visible={modalVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <View style={modalStyles.inputContainer}>
                            <TextInput keyboardType='name-phone-pad' style={modalStyles.inputBox} placeholder="Shop Name" value={shopData.name}/>
                            <TextInput keyboardType='name-phone-pad' multiline={true} underlineColorAndroid='transparent' style={modalStyles.inputBox} placeholder="Shop Address" value={shopData.address_string}/>
                        </View>
                        <Text style={modalStyles.modalText}>Note: Clicking "Update Shop" will set your current location as the shop's geolocation. This is used to verify attendance. Please proceed only when you're at your shop.</Text>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button}>
                                <Text style={styles.buttonText}>Update Shop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View> : null
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'flex-end',
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

    headerTextDetailsBold: {
        fontSize: 16,
        fontWeight: 'bold',
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

    modalView: {
        margin: 16,
        backgroundColor: "white",
        borderRadius: 4,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4,

        marginVertical: 8,
    },

    inputBoxInactive: {
        borderColor: '#0A6FEB66',
        borderRadius: 4,
        borderWidth: 2,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4,

        marginVertical: 8,
        color: 'grey'
    },

    button: {
        backgroundColor: '#0A6FEB',
        borderRadius: 4,
        paddingVertical: 8,
        width: '45%',
        marginHorizontal: 16
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
        marginVertical: 16,
        fontSize: 12
    },

    qrImage: {
        width: 256,
        height: 256,
    }
});

export default Shop;