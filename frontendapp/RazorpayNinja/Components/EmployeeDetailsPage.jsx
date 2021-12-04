import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Calendar } from 'react-native-calendars';
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';
import { useNavigation } from '@react-navigation/native';

function EmployeeDetails (props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState();

    const [newDate, setNewDate] = useState();
    const [newAmount, setNewAmount] = useState();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [nextMonth, setNextMonth] = useState(false);
    const [marker, setMarker] = useState({});

    const [attendance, setAttendance] = useState([]);

    const navigation = useNavigation();

    const getEmployees = () => {
        var newDateLocal;
        
        const requestOptions = {
            method : 'get',
            url : `/attendance/?user_id=${props.route.params.id}`,
        }
        axiosAuthorizedInstance(requestOptions)
        .then((response) => { setAttendance(response.data.attendances); setData(response.data); setNewAmount(response.data.employee_data.payout.amount / 100); setNewDate(response.data.employee_data.payout.date_of_every_month); newDateLocal = response.data.employee_data.payout.date_of_every_month;  })
        .then(() => {
            var now = + new Date();
            now += 2592000000;
            var nextMonth = new Date(now);
            setNextMonth(nextMonth);

            var date = nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + '-' + newDateLocal.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            var markerLocal = {};
            markerLocal[date] = { selectedColor: '#0A6FEB', selected: true };
            setMarker(markerLocal);
        })
        .catch((error) => { console.error(error) });
    }

    useEffect(() => {
        getEmployees();
    }, []);

    const updateMarker = (date) => {
        var markerLocal = {};
        markerLocal[date.dateString] = { selectedColor: '#0A6FEB', selected: true };
        setMarker(markerLocal);
        setNewDate(date.day);
    }

    const updatePayouts = () => {
        const requestOptions = {
            method : 'post',
            url : `/salary/payout/`,
            data: { user_id: props.route.params.id, amount: newAmount * 100, date: newDate }
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { console.log(response.data); setModalVisible(false); }).catch((error) => { console.error(error) });
    }

    const deleteEmployee = () => {
        const requestOptions = {
            method : 'delete',
            url : `/accounts/profiles/?user_id=${props.route.params.id}`,
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { navigation.navigate('Employee'); }).catch((error) => { console.error(error) });
    }

    const triggerDeleteAlert = () => {
        Alert.alert(
            'Alert',
            `Are you sure you want to remove ${data.employee_data.name} from your employees list? This action cannot be reversed.`,
            [ { text: "Remove", style: 'destructive', onPress: () => deleteEmployee() }, { text: "Cancel" }]
        );
    }

    return (
        data && attendance ?
        <ScrollView style={styles.page}>
            <View style={styles.header}>
                <View style={styles.headerImage}/>
                <View style={styles.headerText}>
                    <Text style={styles.headerTextName}>{data.employee_data.name}</Text>
                    <Text style={styles.headerTextDetails}>Next payout of {newAmount}₹ on {months[(new Date().getMonth() + 1) % 12]} {newDate}</Text>
                </View>
            </View>
            <Calendar onDayPress={(day) => { if (day.timestamp <= + new Date()) navigation.navigate('Attendance', { date: day.dateString, id: props.route.params.id }); }}
                markedDates={attendance}
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
                <TouchableOpacity activeOpacity={0.8} style={styles.buttonRed} onPress={() => triggerDeleteAlert()}>
                    <Text style={styles.buttonText}>Remove Employee</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType='fade' transparent={true} visible={modalVisible}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Calendar onDayPress={(day) => updateMarker(day)}
                        markedDates={marker}
                        theme={{
                            textDayFontWeight: '600',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 14,
                            textMonthFontSize: 14,
                            textDayHeaderFontSize: 14
                        }}
                        current={nextMonth}
                        monthFormat={'MMM yyyy'} hideArrows={true} hideExtraDays={true} disableMonthChange={true} firstDay={1} disableArrowLeft={true} disableArrowRight={true}/>
                        <View style={modalStyles.inputContainer}>
                            <TextInput keyboardType='numeric' maxLength={6} style={modalStyles.inputBox} value={String(newAmount)} onChangeText={(amount) => setNewAmount(amount)} placeholder="Salary Amount"/>
                        </View>
                        <View style={modalStyles.buttonsContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.button} onPress={() => updatePayouts()}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={modalStyles.buttonRed} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Discard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView> : 
        null
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