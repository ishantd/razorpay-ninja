import React , {useEffect, useState} from 'react'
import {
    ScrollView,
    View,
    Text,
    Image,
    Alert,
    Dimensions,
    Platform,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Constants from 'expo-constants'
import {TextInput, Button} from 'react-native-paper'
import axios from 'axios'
import AppLoading from 'expo-app-loading';
import StyleSheet from 'react-native-extended-stylesheet'
import {axiosAuthorizedInstance as axiosY} from '../CustomAxios/CustomAxios'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// import {  Snackbar } from 'react-native-paper';

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


const Profile = (props) => {

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

    
    // const [bank, setBank] = useState();
    const [ifsc, setIFSC] = useState();
    const [account, setAccount] = useState();
    const [phone, setPhone] = useState();
    const [shopCode, setShopCode] = useState();
    const [accountHolder, setAccountHolder] = useState()
    const [img, setImage] = useState(null);
    const [visible, setVisible] = useState(false);


    const [shopExists, setShopExists] = useState(false);
    const [mobileExists, setMobileExists] = useState(false);
    const [nameExists, setNameExists] = useState(false);
    const [accountExists, setAccountExists] = useState(false);
    const [ifscExists, setIFSCExists] = useState(false);
    const [loading, setLoading] = useState(false)
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
            setImage(result);
          }
    }




    const getData = async () => {
        try{

            const accountProfile = await axiosY({
                method : 'get',
                url : '/accounts/profiles/'
            });
            setPhone(accountProfile.data.data.phone)
            setImage(accountProfile.data.data.profile_photo)
            setShopCode(accountProfile.data.data.shop.unique_code)
            if (accountProfile.data.data.shop.unique_code?.length>0){
                setShopExists(true)
            }
            if (accountProfile.data.data.phone?.length>0){
                setMobileExists(true)
            }
            

            // console.log(accountProfile.data)
            
            const bankDeets = await axiosY({
                method : 'get',
                url : '/accounts/bank-account/'
            })
            // console.log(bankDeets.data)
            setAccountHolder(bankDeets.data.bank_details.name_at_bank)
            setAccount(bankDeets.data.bank_details.account_number)
            setIFSC(bankDeets.data.bank_details.ifsc)

            if (bankDeets.data.name_at_bank?.length>0){
                setNameExists(true)
            }
            if (bankDeets.data.account_number?.length>0){
                setAccountExists(true)
            }
            if (bankDeets.data.ifsc?.length>0){
                setIFSCExists(true)
            }
        }   
        catch(err){
            console.log(err)
        }
    }

    const submitData = async () => {
        setLoading(true)
        try{
            console.log("Requested")
            let accountProfile, bank, shop;
            // const base64 = await FileSystem.readAsStringAsync(img, { encoding: 'base64' });
            // console.error(base64)
            console.log(img)
            let promises  = [];
            if (phone){
                 accountProfile = await axiosY({
                    url : '/accounts/profiles/',
                    method : 'post',
                    data : {
                        phone : phone,
                        role : 'emp',
                        profile_photo : img?`data:image/jpg;base64,${img?.base64}`:""
                    }
                })
            }
            // console.log(accountProfile.data)
            if (accountProfile.status === 200) setMobileExists(true);

            if (ifsc && account && accountHolder){
                bank = await axiosY({
                    url : '/accounts/bank-account/',
                    method : 'post',
                    data : {
                        account_number : account,
                        ifsc : ifsc,
                        account_holder : accountHolder
                    }
                }) 
            }


            if (true){
                shop = await axiosY({
                    url : '/accounts/join-shop/',
                    method : 'post',
                    data : {
                        shop_code : shopCode
                    }
                })
            }
            // promises = [accountProfile, bank, shop]


            
            // const res = await Promise.all(promises);
            


            
            props.navigation.navigate("Attendance")
            setLoading(false)
        }
        catch(err){
            console.log(err)
            setLoading(false)

        }
    }
    useEffect(()=>{
        getImgPermission();
        getData()
    },[])

    if (!fontsLoaded) {
        return <AppLoading/>
    }
    return (
            <KeyboardAwareScrollView
                contentContainerStyle ={{
                display: "flex",
                // flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
                height: Dimensions.get("window").height,
                width: Dimensions.get("window").width,
            }}
            >
            <View style={classes.container}>
            
                    <View style={classes.section1}>
                        <View>
                            <Text
                                style={classes.topText}
                            >
                                Welcome,
                            </Text>
                        
                            <Text
                                style={classes.secondary}
                            >
                                Welcome to your Profile Page! Here you can manage all the important aspects of your account
                            </Text>
                        </View>
                    </View>
                    <View style={classes.section2}>
                    
                    <TouchableOpacity onPress = {pickImage}>
                        <Image
                        onLoadStart = {()=>setVisible(false)}
                        onLoadEnd = {()=>setVisible(true)}
                        style={classes.logo} source={!img?require('../assets/placeholder.png'):{uri : img.uri?img.uri : img}}></Image>
                        {!visible?<ActivityIndicator size="large" color="#102461" style={{position : 'absolute', alignSelf : 'center', marginTop : 50}}></ActivityIndicator>:null}
                    </TouchableOpacity>
                    
                    <TextInput
                        label = "Shop Code"
                        value = {shopCode}
                        onChangeText = {text => setShopCode(text)}
                        mode="outlined"
                        style={classes.textInput}
                        theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                        disabled={shopExists}
                    />
                    <TextInput
                        label = "Phone Number"
                        value = {phone}
                        onChangeText = {text => setPhone(text)}
                        mode="outlined"
                        style={classes.textInput}
                        theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                    />
                    
                    <><TextInput
                        label="Account Holder"
                        value={accountHolder}
                        onChangeText={text => setAccountHolder(text)}
                        mode="outlined"
                        style={classes.textInput}
                        theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                        disabled={nameExists}
                    />
                    <TextInput
                        label="Account Number"
                        value={account}
                        onChangeText={text => setAccount(text)}
                        mode="outlined"
                        style={classes.textInput}
                        theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                        disabled={accountExists}
                        keyboardType="number-pad"

                    />
                    <TextInput
                        label = "IFSC"
                        value = {ifsc}
                        onChangeText = {text => setIFSC(text)}
                        mode="outlined"
                        style={classes.textInput}
                        theme={{ colors: { primary: '#102461',underlineColor:'transparent',}}}
                        disabled={ifscExists}
                    />
                    </>
                    <Button onPress={submitData} mode="contained" color="#102461" style={{width : "96%", alignSelf : "center"}}>{"Update Details"}</Button>
                    {loading?<ActivityIndicator size="small" color="white"></ActivityIndicator>:null}
                </View>
            </View>
            
            </KeyboardAwareScrollView>
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
        marginBottom : "0.5rem",
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
        width : 100,
        height : 100,
        borderRadius : 100/2,
        alignSelf : 'center',
        marginTop : 8,
        borderWidth : 2,
        borderColor : '#102461',
    }
})
