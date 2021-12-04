import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';

function EmployeeCard (props) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => props.onPress()}>
            <View style={styles.cardImage}/>
            <View style={styles.cardTextSection}>
                <Text style={styles.cardTextHeading}>{props.name}</Text>
                <Text style={styles.cardTextSubheading}>{`Next payout on ${months[(new Date().getMonth() + 1) % 12]} ${props.subheading}`}</Text>
            </View>
            <View style={styles.cardIcon}>
                <Ionicons name={'chevron-forward'} size={24} color={'#0A6FEB'} />
            </View>
        </TouchableOpacity>
    );
}

function Employees (props) {
    const navigation = useNavigation();
    const [employees, setEmployees] = useState([]);
    const focused = useIsFocused();

    const getEmployees = () => {
        const requestOptions = {
            method : 'get',
            url : '/attendance/',
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { setEmployees(response.data.employee_data) }).catch((error) => { console.error(error) });
    }

    useEffect(() => {
        getEmployees();
    }, []);

    useEffect(() => {
        if (focused) getEmployees();
    }, [focused]);

    return (
        <ScrollView style={styles.page}>
            {
                employees ? employees.map((employee, index) => { return <EmployeeCard name={employee.name} photo={employee.profile_photo} subheading={employee.payout.date_of_every_month} onPress={() => navigation.navigate('EmployeeDetails', { id: employee.user_id })} key={index}/> })  : null
            }
        </ScrollView>
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
        fontSize: 16,
        color: '#000000'
    },

    cardIcon: {

    },
});

export default Employees;