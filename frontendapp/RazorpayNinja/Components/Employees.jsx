import React, { useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import { axiosAuthorizedInstance } from '../CustomAxios/customAxios';

function EmployeeCard (props) {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => props.onPress()}>
            <View style={styles.cardImage}/>
            <View style={styles.cardTextSection}>
                <Text style={styles.cardTextHeading}>{props.name}</Text>
                <Text style={styles.cardTextSubheading}>{props.subheading}</Text>
            </View>
            <View style={styles.cardIcon}>
                <Ionicons name={'chevron-forward'} size={24} color={'#0A6FEB'} />
            </View>
        </TouchableOpacity>
    );
}

function Employees (props) {
    const navigation = useNavigation();

    const getEmployees = () => {
        const requestOptions = {
            method : 'get',
            url : '/attendance/',
        }
        axiosAuthorizedInstance(requestOptions).then((response) => { console.log(response.data) }).catch((error) => { console.error(error) });
    }

    useEffect(() => {
        getEmployees();
    }, []);

    return (
        <ScrollView style={styles.page}>
            <EmployeeCard name={'Employee Name'} onPress={() => navigation.navigate("EmployeeDetails")} subheading={'Next payout on Jan 12'}/>
            <EmployeeCard name={'Employee Name'} onPress={() => navigation.navigate("EmployeeDetails")} subheading={'Next payout on Jan 12'}/>
            <EmployeeCard name={'Employee Name'} onPress={() => navigation.navigate("EmployeeDetails")} subheading={'Next payout on Jan 12'}/>
            <EmployeeCard name={'Employee Name'} onPress={() => navigation.navigate("EmployeeDetails")} subheading={'Next payout on Jan 12'}/>
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