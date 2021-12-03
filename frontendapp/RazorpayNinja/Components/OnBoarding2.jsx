import React, { Component, useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import {TextInput, Button } from 'react-native-paper'
import Constants from 'expo-constants'
import {axiosAuthorizedInstance as axiosY} from '../CustomAxios/customAxios'
import StyleSheet from 'react-native-extended-stylesheet'
import {
    useFonts,
    Sora_100Thin,
    Sora_200ExtraLight,
    Sora_300Light,
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
} from '@expo-google-fonts/sora';
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';





export default function OnBoarding1 (props){
    let [fontsLoaded] = useFonts({
        Sora_100Thin,
        Sora_200ExtraLight,
        Sora_300Light,
        Sora_400Regular,
        Sora_500Medium,
        Sora_600SemiBold,
        Sora_700Bold,
        Sora_800ExtraBold,
        Roboto_100Thin,
        Roboto_100Thin_Italic,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_700Bold_Italic,
        Roboto_900Black,
        Roboto_900Black_Italic,
    });

    const [shopName, setShopName] = useState("")
    const [address, setAddress] = useState("")
    const [bankAccount, setBankAccout] = useState("")
    const [ifsc, setIFSC] = useState("")
    
    const handleProceed = async () => {
        try{
            // const res = await axiosY({
            //     method : 'post',
            //     url : '/accounts/profiles/',
            //     data : {
            //         address,
            //         role,
            //         phone
            //     }
            // })
            
            props.navigation.navigate("Main")

        }
        catch(err){
            console.log(err)
        }
    }


    if (!fontsLoaded) {
        return <AppLoading />;
    }  
    return (
        <View style={classes.container}>
                <View 
                    style={classes.header}
                >
                    <Text style={classes.primary}>
                        Create a Shop
                    </Text>
                    <Text style={classes.secondary}>
                        Manage your shop with ease, the one stop solution to all your problems.
                    </Text>
                </View>
                <View style={classes.InputArea}>
                    <TextInput
                    theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                    value={shopName}
                    onChangeText={(text)=>setShopName(text)}
                    style={classes.textInput}
                    label="Shop Name"
                    mode="outlined"
                    >
                    
                    </TextInput>
                    <TextInput
                    theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                    mode="outlined"
                    label="Role"
                    value={bankAccount}
                    onChangeText={(text)=>setBankAccount(text)}
                    style={classes.textInput}
                    >

                    </TextInput>
                    <TextInput
                    theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                    mode="outlined"
                    label="Phone"
                    style={classes.textInput}
                    value={ifsc}
                    onChangeText={(text)=>setIFSC(text)}
                    >
                        
                    </TextInput>
                    <TextInput style={classes.textInput}
                        theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                        mode="outlined"
                        label="Shop Location"
                        multiline
                        numberOfLines={3}
                        value={address}
                        onChangeText={(text)=>setAddress(text)}
                    >
                        
                    </TextInput>
                    <View style={classes.buttonArea}>
                        <Button style={classes.button} mode="contained" color ="#102461" onPress={handleProceed}>Proceed</Button>
                    </View>
                </View>
                
        </View>
    )
}


const classes = StyleSheet.create({
    container : {
        marginTop : Constants.statusBarHeight,
        flex : 1,
        
        width : '100%',
        backgroundColor : "#7d96e333",
        paddingRight : "1rem",
        paddingLeft : "1rem",
        paddingTop : "2rem"
    },
    header : {
        paddingBottom : "2rem",
        paddingLeft : "0.5rem"
    },
    primary : {
        fontFamily : 'Roboto_700Bold',
        fontSize : "1.5rem",
        color : "#102461"
    },
    secondary : {
        fontFamily : 'Sora_300Light',
        color : '#102461',
        opacity : 0.4
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
    buttonArea : {
        marginTop : "2rem",
        paddingLeft : "0.5rem",
        paddingRight : "0.5rem"
        // width : "90%"
    }
})