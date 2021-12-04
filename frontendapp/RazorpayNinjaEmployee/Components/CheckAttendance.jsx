import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import {Dimensions} from 'react-native';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import Constants from 'expo'
import * as ImagePicker from 'expo-image-picker';

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


const CheckAttendance = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef();
    const [showCamera, setCamera] = useState(true) 
    const [user, setUser] = useState();


    

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

    const getCamera = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    }


    // const takePicture = async () => {
    //     try{
    //         if (cameraRef) {
    //             let photo = await cameraRef.current.takePictureAsync({
    //                 base64 : true
    //             });
    //             // console.error(photo.base64)
    //             if (type === Camera.Constants.Type.front) {
    //                 photo = await manipulateAsync(
    //                     photo.localUri || photo.uri,
    //                     [
    //                         { rotate: 180 },
    //                         { flip: FlipType.Vertical },
    //                     ],
    //                     { compress: 1, format: SaveFormat.PNG , base64 : true}
    //                 );
    //             }
    //             setCamera(false)
    //             setUser(photo.base64);
    //         }
    //         } catch(err) {
    //             console.error(err.message);
    //         }
    // }

    useEffect(()=>{
        // getCamera();
        getLocation();
    },[])

    return (
    <View style={styles.container}>
      {showCamera?<Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            
            <Text style={styles.text}> Flip </Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={
              takePicture
            }>
            
            
            <Text style={styles.text}> Snap </Text>

          </TouchableOpacity>
        </View>
      </Camera> : 
        <View style={styles.container}>
            <Image source={{uri: `data:image/png;base64,${user}`}} style={styles.image}/>
            <TouchableOpacity style={styles.button2} onPress={()=>{setCamera(true)}}>
                <Text style={styles.text2}> Back </Text>
            </TouchableOpacity>
        </View>
      }
    </View>
    )
}

export default CheckAttendance

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width : "100%"
    },
    image : {
        width : Dimensions.get('window').width,
        height : Dimensions.get('window').height,
        zIndex : -1,
    },  
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      width : "100%",
      justifyContent : 'space-between',
    //   margin: 20,
      padding : 60
    },
    button: {
    //   flex: 0.1,
      alignSelf: 'flex-end',
      justifyContent : 'center',
      alignItems : 'center',
      width : 60,
      height : 60,
      textAlign : 'center',
      borderWidth : 1,
      borderColor : 'white',
      borderRadius : 60/2
    //   alignItems: 'center',
    //   backgroundColor : 'white'
    },
    text: {
        fontSize: 18,
        color: 'white',

      },
    button2: {
        
        marginTop : -100,
        // backgroundColor: 'white',
        
    },

  });
  