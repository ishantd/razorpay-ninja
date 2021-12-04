import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

function ShopOnboarding (props) {
    return (
        <ScrollView style={styles.page}>
            <View style={styles.header}>
                <View style={styles.headerImage}/>
                <View style={styles.headerText}>
                    <Text style={styles.headerTextName}>Shop Setup</Text>
                    <Text style={styles.headerTextDetails}>Enter the following details to set up your shop.</Text>
                </View>
            </View>
            <View style={modalStyles.inputContainer}>
                <TextInput keyboardType='name-phone-pad' style={modalStyles.inputBox} placeholder="Shop Name"/>
                <TextInput keyboardType='name-phone-pad' multiline={true} underlineColorAndroid='transparent' style={modalStyles.inputBox} placeholder="Shop Address"/>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Create Shop</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        flex: 1
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

export default ShopOnboarding;