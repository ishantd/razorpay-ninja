import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import AppLoading from 'expo-app-loading';
import Constants from 'expo-constants'
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


const Card = (props) => {
    return (
        <View style={classes.card} >
            <View style={classes.cardBody}>
                <View style={classes.textBox}>
                    <Text
                        style={{
                            fontFamily : 'Roboto_500Medium',
                            fontSize : 15,
                            marginBottom : 3, 
                        }}
                    >
                        {props.header}
                    </Text>
                    <Text
                     style={{
                        fontFamily : 'Sora_200ExtraLight',
                        fontSize : 10,
                        textAlign : 'justify',
                    }}
                    >
                        {props.description}
                    </Text>
                </View>
            </View>
        </View>
    );

}


const Payroll = () => {
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

    const renderItem = ({item}) => (
        <Card
            // icon={item.icon}
            header={item.header}
            description={item.description}
            // nav = {props.navigation}
            // page= {item.page}
        ></Card>
    )     

    if (!fontsLoaded){
        return <AppLoading/>
    }
    return (
        <View style={classes.container}>
            
            <View style={classes.section1}>
                <Text
                    style={classes.topText}
                >
                    Payroll Manager
                </Text>
            </View>
            
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.header}
                style={classes.cardContainer}
            />
        </View>
    )
}


const data = [
    {
        header : "June, 2021",
        description : "Paid"
    },
    {
        header : "July, 2021",
        description : "Paid"
    },
    {
        header : "August, 2021",
        description : "Paid"
    },
    {
        header : "September, 2021",
        description : "Paid"
    },
    {
        header : "October, 2021",
        description : "Not Paid"
    },
    {
        header : "November, 2021",
        description : "Paid"
    },

]

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
})

export default Payroll
