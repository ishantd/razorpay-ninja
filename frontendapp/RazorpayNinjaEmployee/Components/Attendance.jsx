import React, {useState, useEffect, useRef} from 'react'
import { View, Text, ScrollView,TouchableWithoutFeedback } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants'
import * as Location from 'expo-location';

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {
    ProgressChart,
  } from 'react-native-chart-kit'
import {
    useFonts,
    
    Sora_200ExtraLight,
    Sora_300Light,
    Sora_500Medium,
    Sora_600SemiBold,
 
} from '@expo-google-fonts/sora';
import {
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_500Medium,
    Roboto_700Bold,
} from '@expo-google-fonts/roboto';


const Attendance = (props) => {
    let [fontsLoaded] = useFonts({
        Sora_200ExtraLight,
        Sora_300Light,
        Sora_500Medium,
        Sora_600SemiBold,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    

    const chartConfig = {
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        color: (opacity = 1) => `rgb(16,36,97,${opacity})`
    }

  

    const getRandomUser =  async () => {
        
        try{
            const response = await axios('https://randomuser.me/api/');
            setUser(response.data.results)
        }
        catch(err){
            console.error(err)
        }
    }   

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const getLocation = async () => {
        try{
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }
            let location = await Location.getCurrentPositionAsync({
                accuracy : Location.Accuracy.Balanced,
            });
            // console.error(location)
            setLocation(location);
        } catch(err) {
            console.error(err.message);
        }
    }



    useEffect(()=>{
        getLocation()
    },[])

    const data = [0.4]
    
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const markedDates = {
        '2021-12-01': { marked: true, dotColor: 'blue'},
        '2021-12-02': {marked: true, dotColor: 'red'},
        '2021-12-03': {marked: true, dotColor: 'red', activeOpacity: 0},
        // '2021-12-04': {disabled: true, disableTouchEvent: true}
      }
    


    

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={classes.container}>
            <View style={classes.section1}>
                <Text
                    style={classes.topText}
                >
                    Attendance Tracker
                </Text>
            </View>
            <View style={classes.section2}>
                <View
                    style={classes.calendarContainer}
                >
                <Calendar
                    current = {date}
                    minDate = {firstDay}
                    maxDate = {lastDay}
                    markedDates = {markedDates}
                />
                </View>
            </View>
            <View style={classes.section3}>
                <View style={classes.container2}>
                    <View style={classes.card3}>
                    <ProgressChart
                        data={data}
                        width={180}
                        height={150}
                        chartConfig={chartConfig}
                    />
                    <Text
                        style={{
                            position : "absolute",
                            bottom : 8,
                            left : 20,
                            fontFamily : 'Sora_300Light',
                            fontSize : 9
                        }}
                    >Attendance Percentage</Text>
                    </View>
                    <View style={classes.card4}>
                        <Text
                            style={classes.textBubblePositive}
                        >Days Present : 8</Text>
                        <Text
                            style={classes.textBubbleNegative}
                        >Days Absent : 12</Text>
                        <TouchableWithoutFeedback 

                            onPress={() => props.navigation.navigate("CheckAttendance")}
                        >
                            <Text style={classes.mark}>Mark Today</Text>
                        </TouchableWithoutFeedback>
                        
                    </View>
                </View>
            </View>
        </View>
    )
}

const classes = StyleSheet.create({
    container: {
        marginTop : Constants.statusBarHeight,
        flex: 1,
        width : "100%",
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : "#7d96e333",

    },
    section1 :{
        flex : 0.5,
        alignItems : 'center',
        justifyContent : 'center',
        width : "100%",
        backgroundColor : '#102461'
    },
    topText : {
        fontSize :16,
        fontFamily : "Sora_500Medium",
        color : "white"
    },
    calendarContainer : {
        width : "90%",
        marginTop : -20
    },
    section2 : {
        flex : 2,
        alignItems : 'center',
        width : "100%",

    },
    section3 : {
        flex : 1,
        // width : "100%",
        // alignItems : 'center',
        // justifyContent : 'space-between',
        width : "100%"
        
    },
    container2 : {
        flexDirection : 'row',
        width : "100%",
        justifyContent : 'space-between',
        paddingLeft : 10,
        paddingRight : 10,
    },  
    card1 : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        width : "95%",
        paddingTop : 24,
        paddingBottom : 24,
        backgroundColor : "white",
        paddingLeft : 12,
        paddingRight : 12,
        borderRadius : 2
        // width : "100%"
    },
    text : {
        fontFamily : 'Roboto_500Medium',

    },
    card4 : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center",
        backgroundColor : "white"
    },
    textBubblePositive : {
        width : "80%",
        textAlign : "center",
        backgroundColor : '#0A6FEB',
        marginBottom : 12,
        paddingTop : 8,
        paddingBottom : 8,
        color : "white",
        fontFamily : 'Roboto_300Light',
        borderRadius : 2
    },
    textBubbleNegative : {
        width : "80%",
        textAlign : "center",
        marginBottom : 12,

        paddingTop : 8,
        paddingBottom : 8,
        backgroundColor : '#102461',
        color : "white",
        fontFamily : 'Roboto_300Light',
        borderRadius : 2
    },
    mark : {
        width : "80%",
        textAlign : "center",
        paddingTop : 8,
        paddingBottom : 8,
        backgroundColor : 'white',
        // color : "white",
        color : '#102461',
        borderWidth : 0.5,
        fontFamily : 'Roboto_500Medium',
        borderRadius : 2
    }
    
})



export default Attendance
