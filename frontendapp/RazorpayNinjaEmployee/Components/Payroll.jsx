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
                        fontFamily : 'Sora_300Light',
                        fontSize : 15,
                        color : props.description === "Paid"?"green":"red",
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
                <Text
                    style={classes.secondary}
                >
                    Check All your payments received from a particular shop
                </Text>
            </View>
            <View style={classes.section2}>
                <FlatList
                    style={{width : "100%", marginTop : -20}}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.header}
                    style={classes.cardContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
        alignItems : 'flex-start',
        justifyContent : 'flex-end',
        width : "100%",
        backgroundColor : '#102461'
    },
    section2 : {
        flex : 2,
        // paddingLeft : 20,
        // paddingRight : 20,
        alignItems : "center",
        // backgroundColor : '#7d96e333',
        paddingTop : 10,
        paddingLeft : 20,
        paddingRight : 20,
        width : "100%"
        // zIndex : 5,
        // elevation : 5
    },
    topText : {
        fontSize :16,
        fontFamily : "Sora_500Medium",
        color : "white",
        paddingLeft : 20,
    },

    card : {
        backgroundColor : "white",
        width : 300,
        height : 80,
        marginBottom : 15,
        paddingLeft : 15,
        paddingRight : 15,
        borderRadius : 2
        // marginTop : -15
    },
    cardBody: {
        width : '100%',
        flex : 1,
        justifyContent : "center"
    },
    textBox : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
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

})

export default Payroll
