import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Calendar } from 'react-native-calendars';

function EmployeeDetails (props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <ScrollView style={styles.page}>
            <View style={styles.header}>
                <View style={styles.headerImage}/>
                <View style={styles.headerText}>
                    <Text style={styles.headerTextName}>Employee Name</Text>
                    <Text style={styles.headerTextDetails}>Next payout of 10,000₹ on Jan 12</Text>
                </View>
            </View>
            <Calendar onDayPress={(day) => {console.log('selected day', day)}} onDayLongPress={(day) => {console.log('selected day', day)}}
            markedDates={{
              '2021-12-01': {selectedColor: '#2CDD93', selected: true},
              '2021-12-22': {selectedColor: '#2CDD93', selected: true},
              '2021-12-23': {selectedColor: '#2CDD93', selected: true},
              '2021-12-24': {selectedColor: '#FF9700', selected: true},
              '2021-12-25': {selectedColor: '#D44333', selected: true}
            }}
            theme={{
                textDayFontWeight: '600',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 14,
                textMonthFontSize: 14,
                textDayHeaderFontSize: 14
            }}
            monthFormat={'MMM yyyy'} hideArrows={true} hideExtraDays={true} disableMonthChange={true} firstDay={1} disableArrowLeft={true} disableArrowRight={true}/>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Edit Payout Details</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.buttonRed}>
                    <Text style={styles.buttonText}>Remove Employee</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType='fade' transparent={true} visible={modalVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Calendar onDayPress={(day) => {console.log('selected day', day)}}
                        markedDates={{
                          '2022-01-12': {selectedColor: '#0A6FEB', selected: true},
                        }}
                        current={'2022-01-01'}
                        theme={{
                            textDayFontWeight: '600',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 14,
                            textMonthFontSize: 14,
                            textDayHeaderFontSize: 14
                        }}
                        monthFormat={'MMM yyyy'} hideArrows={true} hideExtraDays={true} disableMonthChange={true} firstDay={1} disableArrowLeft={true} disableArrowRight={true}/>
                        <View style={modalStyles.inputContainer}>
                            <TextInput keyboardType='numeric' maxLength={6} style={modalStyles.inputBox} placeholder="Salary Amount"/>
                        </View>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Discard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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

export default EmployeeDetails;