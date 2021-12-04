import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Alert, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';

function CustomerCard (props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardTextSection}>
                <Text style={styles.cardTextHeading}>{props.name}</Text>
                <Text style={styles.cardTextSubheading}>{props.subheading}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.cardIcon}>
                <Ionicons name={'trash'} size={24} color={'#0A6FEB'} />
            </TouchableOpacity>
        </View>
    );
}

function Customers (props) {
    const navigation = useNavigation();
    const [modalCustomerVisible, setModalCustomerVisible] = useState(false);
    const [modalCampaignVisible, setModalCampaignVisible] = useState(false);

    return (
        <View style={styles.page}>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalCampaignVisible(true)}>
                <Text style={styles.buttonText}>Create New Campaign</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalCustomerVisible(true)}>
                <Text style={styles.buttonText}>Add Customer</Text>
            </TouchableOpacity>
            <ScrollView>
                <CustomerCard name={'Customer Name'} subheading={'9643099621'}/>
                <CustomerCard name={'Customer Name'} subheading={'9643099621'}/>
                <CustomerCard name={'Customer Name'} subheading={'9643099621'}/>
                <CustomerCard name={'Customer Name'} subheading={'9643099621'}/>
            </ScrollView>
            <Modal animationType='fade' transparent={true} visible={modalCustomerVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <View style={modalStyles.inputContainer}>
                            <TextInput keyboardType='name-phone-pad' style={modalStyles.inputBox} placeholder="Customer Name"/>
                            <TextInput keyboardType='number-pad' maxLength={10} style={modalStyles.inputBox} placeholder="Customer Mobile"/>
                        </View>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button}>
                                <Text style={styles.buttonText}>Add Customer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => setModalCustomerVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal animationType='fade' transparent={true} visible={modalCampaignVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <TextInput keyboardType='name-phone-pad' multiline={true} underlineColorAndroid='transparent' style={modalStyles.inputBox} placeholder="Campaign Message"/>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button}>
                                <Text style={styles.buttonText}>Send Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => setModalCampaignVisible(false)}>
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