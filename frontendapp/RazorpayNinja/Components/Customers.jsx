import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Alert, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';

function CustomerCard (props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardTextSection}>
                <Text style={styles.cardTextHeading}>{props.name}</Text>
                <Text style={styles.cardTextSubheading}>{props.subheading}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.cardIcon} onPress={() => props.onPress()}>
                <Ionicons name={'trash'} size={24} color={'#0A6FEB'} />
            </TouchableOpacity>
        </View>
    );
}

function Customers (props) {
    const navigation = useNavigation();
    const [modalCustomerVisible, setModalCustomerVisible] = useState(false);
    const [modalCampaignVisible, setModalCampaignVisible] = useState(false);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const [customers, setCustomers] = useState([]);
    const [campaignMessage, setCampaignMessage] = useState('');

    const getCustomers = () => {
        const requestOptions = {
            method : 'get',
            url : '/accounts/customer/',
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { setCustomers(response.data.customers); console.log(response.data.customers); }).catch((error) => { console.error(error) });
    }

    const createCustomer = () => {
        const requestOptions = {
            method : 'post',
            url : '/accounts/customer/',
            data : { name : customerName, phone : customerPhone }
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { setModalCustomerVisible(false); getCustomers(); setCustomerName(''); setCustomerPhone(''); }).catch((error) => { console.error(error) });
    }

    const sendMessage = () => {
        const requestOptions = {
            method : 'post',
            url : '/accounts/publish/',
            data : { message : campaignMessage }
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { setModalCampaignVisible(false); }).catch((error) => { console.error(error) });
    }

    const deleteCustomer = (id) => {
        const requestOptions = {
            method : 'delete',
            url : '/accounts/customer/',
            data : { customer_id: id }
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { getCustomers(); }).catch((error) => { console.error(error) });
    }

    const triggerDeleteAlert = (customer) => {
        Alert.alert(
            'Alert',
            `Are you sure you want to remove ${customer.name} from your customers list? This action cannot be reversed.`,
            [ { text: "Remove", style: 'destructive', onPress: () => deleteCustomer(customer.id) }, { text: "Cancel" }]
        );
    }

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <View style={styles.page}>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalCampaignVisible(true)}>
                <Text style={styles.buttonText}>Create New Campaign</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalCustomerVisible(true)}>
                <Text style={styles.buttonText}>Add Customer</Text>
            </TouchableOpacity>
            <ScrollView>
                { customers.map((customer, index) => <CustomerCard name={customer.name} key={index} subheading={customer.phone} onPress={() => triggerDeleteAlert(customer)}/>) }
            </ScrollView>
            <Modal animationType='fade' transparent={true} visible={modalCustomerVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <View style={modalStyles.inputContainer}>
                            <TextInput keyboardType='name-phone-pad' style={modalStyles.inputBox} placeholder="Customer Name" value={customerName} onChangeText={(name) => setCustomerName(name)}/>
                            <TextInput keyboardType='number-pad' maxLength={10} style={modalStyles.inputBox} placeholder="Customer Mobile" value={customerPhone} onChangeText={(phone) => setCustomerPhone(phone)}/>
                        </View>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button} onPress={() => createCustomer()}>
                                <Text style={styles.buttonText}>Add Customer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => { setModalCustomerVisible(false); setCustomerPhone(''); setCustomerName(''); }}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal animationType='fade' transparent={true} visible={modalCampaignVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <TextInput keyboardType='name-phone-pad' multiline={true} underlineColorAndroid='transparent' style={modalStyles.inputBox} placeholder="Campaign Message" maxLength={280} value={campaignMessage} onChangeText={(message) => setCampaignMessage(message)}/>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button} onPress={() => sendMessage()}>
                                <Text style={styles.buttonText}>Send Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => { setModalCampaignVisible(false); setCampaignMessage(''); }}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },

    card: {
        flexDirection: 'row',

        backgroundColor: '#FFFFFF',

        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#0A6FEB',

        paddingHorizontal: 16,
        paddingVertical: 8,

        marginHorizontal: 16,
        marginVertical: 12,

        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardImage: {
        width: 64,
        height: 64,
        backgroundColor: '#0A6FEB',
        borderRadius: 32,
    },

    cardTextSection: {

    },

    cardTextHeading: {
        fontSize: 18,
        color: '#000000',
        fontWeight: 'bold',
        marginVertical: 4,
    },

    cardTextSubheading: {
        fontSize: 14,
        color: '#000000'
    },

    cardIcon: {

    },

    button: {
        backgroundColor: '#0A6FEB',
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
        marginBottom: 15,
        textAlign: "center"
    }
});

export default Customers;