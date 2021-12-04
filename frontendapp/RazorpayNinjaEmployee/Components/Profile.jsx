import React , {useEffect, useState} from 'react'
import {  Text, View, Image } from 'react-native'
import Constants from 'expo-constants'
import {TextInput, Button} from 'react-native-paper'
import axios from 'axios'
import AppLoading from 'expo-app-loading';
import StyleSheet from 'react-native-extended-stylesheet'


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


const Profile = () => {

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


    const [bank, setBank] = useState();
    const [ifsc, setIFSC] = useState();
    const [account, setAccount] = useState();
    const [phone, setPhone] = useState();



    if (!fontsLoaded) {
        return <AppLoading/>
    }
    return (
        <View style={classes.container}>
            
            <View style={classes.section1}>
                

                <View>
                    <Text
                        style={classes.topText}
                    >
                        Hello Tirtharaj,
                    </Text>
                
                    <Text
                        style={classes.secondary}
                    >
                        Welcome to your Profile Page! Here you can manage all the important aspects of your account
                    </Text>
                </View>
            </View>
            <View style={classes.section2}>
                <Image style={classes.logo} source={require('../assets/placeholder.png')}></Image>
                <TextInput
                    label = "Phone Number"
                    value = {phone}
                    onChangeText = {text => setPhone(text)}
                    mode="outlined"
                    style={classes.textInput}
                />
                <TextInput
                    label="Bank Name"
                    value={bank}
                    onChangeText={text => setBank(text)}
                    mode="outlined"
                    style={classes.textInput}

                />
                <TextInput
                    label="Bank Name"
                    value={account}
                    onChangeText={text => setAccount(text)}
                    mode="outlined"
                    style={classes.textInput}

                />
                <TextInput
                    label = "IFSC"
                    value = {ifsc}
                    onChangeText = {text => setIFSC(text)}
                    mode="outlined"
                    style={classes.textInput}
                />
                <Button mode="contained" color="#102461" style={{width : "96%", alignSelf : "center"}}>Update Details</Button>
            </View>
            
        </View>
    )
}

export default Profile

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
        flex : 1,
        // flexDirection : 'row',

        // alignItems : 'center',
        justifyContent : 'flex-end',
        width : "100%",
        backgroundColor : '#102461'
    },
    topText : {
        fontSize :16,
        fontFamily : "Sora_500Medium",
        color : "white",
        paddingLeft : 20,
        // paddingBottom :40,
        paddingRight : 50,
        
    },
    section2 : {
        flex : 3,
        // alignItems : 'center',
        width : "100%",

    },
    textInput : {
        // elevation : 1,
        height : "2.5rem",
        paddingLeft : "0.5rem",
        paddingRight : "0.5rem",
        backgroundColor : "#f3f1ef",
        marginBottom : "1rem",
        borderRadius : "0.5rem"
    },
    secondary : {
        color : 'white',
        fontSize : 15,
        fontWeight : '100',
        paddingLeft : 20,
        paddingBottom :20,
        paddingRight : 50,
        fontFamily : 'Sora_200ExtraLight'
    },
    logo : {
        width : 120,
        height : 120,
        borderRadius : 120/2,
        alignSelf : 'center',
        marginTop : 16,
        borderWidth : 2,
        borderColor : '#102461',
        
    }
})
