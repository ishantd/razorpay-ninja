import React, {useState, useEffect, useRef} from 'react'
import { View, Text, ScrollView,TouchableWithoutFeedback,ActivityIndicator } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants'
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker'

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

import {axiosAuthorizedInstance as axiosY} from '../CustomAxios/CustomAxios'


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

    const [present, setDaysPresent] = useState(0)

    const [loading, setLoading] = useState(false);
    const [pageLoad, setPageLoad] = useState(false)
    const chartConfig = {
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        color: (opacity = 1) => `rgb(16,36,97,${opacity})`
    }


    const [img, setImage ] = useState(null)

    const getImgPermission = async () => {
      try{
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
      }
      catch(err){
          console.log(err)
      }
        
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64 : true
      });
      // console.error(result)
      if (!result.cancelled) {
          return result;
        }
    }   
    const [markedDates, setMarkedDates] = useState({
        
    }); 
    const [attendanceMarked, setAttendanceMarked] = useState(false)
    const [attendanceData, setAttendanceData] = useState([]);

    const getAttendanceData = async () => {
        setPageLoad(true)
        try{
            const id = await axiosY.get('/auth/user/');
            const response = await axiosY.get(`/attendance/?user_id=${id.data.pk}`);
            const attendances = response.data.attendances
            setMarkedDates({...attendances})
            setPageLoad(false)
            
        }
        catch(err){
            console.log(err)
            setPageLoad(false)

        }
        finally{
            setPageLoad(false)
        }
    }

    const MarkAbsent = async () => {
        try{
            const data = {
                type : 'absent',
                location : [location.coords.latitude, location.coords.longitude]
            }
            const res = await axiosY({
                method : 'post',
                url : '/attendance/',
                data : data
            })
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

    const MarkPresent = async () => {

        if (attendanceMarked === true) return;

        setLoading(true)
        const te =`${new Date().toISOString().split('T')[0]}`
        const newDates = markedDates;
        newDates[te] = { marked: true, dotColor: 'blue'}
        console.error(newDates)
        setMarkedDates(newDates);
        

        try{
            const ima = await pickImage()
            setImage(ima.uri)
            const data = {
                type : 'present',
                location : {latitude : `${location.coords.latitude}`, longitude : `${location.coords.longitude}`},
                live_image : `data:image/jpg;base64,${ima.base64}`,
            }
            const res = await axiosY({
                method : 'post',
                url : '/attendance/',
                data : data
            })
            setAttendanceMarked(true);
            setLoading(false)
        }
        catch(err){
            console.error(err)
            setLoading(false)

        }
    }



    useEffect(()=>{
        getLocation()
        getImgPermission()
        getAttendanceData()
    },[])

    const data = [0.4]
    
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

   

    


    

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={classes.container}>
            
            {!pageLoad?<>
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
                    disableArrowLeft ={true}
                    disableArrowRight ={true}
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
                        
                        <TouchableWithoutFeedback 

                        onPress={MarkAbsent}
                        >
                            <Text style={{...classes.mark, backgroundColor : '#102461',marginBottom : 12, color : 'white'}}>Mark Absent</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={MarkPresent}
                        >
                            {loading?<ActivityIndicator size="large" color="#102461"></ActivityIndicator> : <Text style={{...classes.mark, color : attendanceMarked?"white":"#102461", backgroundColor : attendanceMarked?"green":"white"}}>{attendanceMarked?"Present":"Mark Present"}</Text>}
                        </TouchableWithoutFeedback>
                        
                    </View>
                </View>
            </View></>:<ActivityIndicator size="large" color="#102461"></ActivityIndicator>}
            
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
