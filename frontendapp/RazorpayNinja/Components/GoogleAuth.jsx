import React, {useEffect, useState} from 'react'
import * as Google from 'expo-google-app-auth';
import {View, Text, Button, TouchableOpacity, Image} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { axiosRequestAuthInstance as axiosN } from '../CustomAxios/customAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('key', value)
    } catch (e) {
      // saving error
    }
}

export default function GAuth(props) {
    const [accessT, setToken] = useState()
    const gLogin = async () => {
        try{
            const {type, accessToken, idToken, user} = await Google.logInAsync({
                iosClientId : `133149144745-ombhlr10huq710h3aciia0kbko2lt93j.apps.googleusercontent.com`,
                androidClientId: `133149144745-a21b3c0c5mfr971m9udrg9eubftv14c7.apps.googleusercontent.com`,
                clientId : '133149144745-pv4bv47njenj3jacusshmvhggq72cect.apps.googleusercontent.com',
                scopes : ['profile', 'email']
            });
            
            if (type!=="success"){
                throw new Error("google sign in failed")
            }
            const authReq = await axiosN({
                method : 'post',
                url : '/accounts/auth/google/',
                data : {
                    access_token : accessToken,
                    code : "",
                    id_token : idToken,
                }
            })
            // throw authReq
            storeData(authReq.data.key)
            props.navigation.navigate("OnBoarding1", {user})
            // throw (authReq)
        }
        catch(e){
            console.error(e)
            throw e
            // throw(process.env.REACT_APP_ANDROID_CID);
            
        }
    }

    useEffect(()=>{
        
    },[])
    
    return (
        <View style={classes.container}>
            <View style={classes.logo}>
                <Image style={classes.img} source={require('../assets/logo-lg.png')}/>
            </View>
            <View
                style={classes.buttonContainer}
            >
                <TouchableOpacity
                style={classes.button}
                onPress={gLogin}
                >
                    <Ionicons name="logo-google" style={classes.google}/>
                    <Text style={classes.text}>Sign In with google</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}


const classes = StyleSheet.create({
    container : {
        flex : 1,
        width : '100%',
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : "#7d96e333",
        marginTop : Constants.statusBarHeight,
        backgroundColor : '#09153b',
    },

    button : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        // padding : 10,
        // paddingLeft : "0.5rem",
        borderRadius : "0.3rem",
        backgroundColor : "white",
    },

    google : {
        fontSize : "1.3rem",
        color : "white",
        marginRight : "0.5rem",
        backgroundColor : '#2649b6',
        height : "100%",
        padding : "0.5rem",
        borderTopLeftRadius : "0.3rem",
        borderBottomLeftRadius : "0.3rem"
    },

    img : {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain'
    },

    text : {
        height : "100%",
        color : "black",
        paddingTop : "0.5rem",
        paddingBottom : "0.5rem",
        paddingLeft : "0.5rem",
        paddingRight : "1.2rem",
        borderTopRightRadius : "0.3rem",
        borderBottomRightRadius : "0.3rem",
        fontSize : "1rem",
        backgroundColor : 'white',
    },

    buttonContainer : {
        flex : 2,
        justifyContent : "center",
        alignItems : "center"
    },

    logo : {
        width : "20rem",
        height : "20rem",
        borderRadius : "6rem",
    }

})
