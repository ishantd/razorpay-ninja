import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert, Dimensions } from 'react-native'
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';

function Attendance (props) {
    const [data, setData] = useState();

    const getAttendanceData = () => {
        console.log(props.route.params.date);
        const requestOptions = {
            method : 'get',
            url : `/attendance/details/?user_id=${props.route.params.id}&date=${props.route.params.date}`,
        }
        axiosAuthorizedInstance(requestOptions)
        .then((response) => { setData(response.data.data); console.log(response.data.data); })
        .catch((error) => { console.error(error) });
    }

    useEffect(() => {
        getAttendanceData();
    }, []);

    return (
        !data ?
        <View style={styles.page}>
            {/*}<Image source={{ uri: data.attendance_time_in_selfie }} resizeMethod='scale' resizeMode='cover' style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').width * 0.8 }} />
            <Image source={{ uri: data.attendance_time_out_selfie }} resizeMethod='scale' resizeMode='cover' style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').width * 0.8 }} />*/}
        </View> : 
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Could Not Retrive Attendance Data</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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

export default Attendance;